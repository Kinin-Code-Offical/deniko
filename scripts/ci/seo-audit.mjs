// scripts/ci/seo-audit.mjs
// Node.js 18+ has global fetch
// import { fetch } from 'undici';
import fs from "node:fs";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";
const SAMPLE_SIZE = Number(process.env.SITEMAP_SAMPLE_SIZE || "25");
const TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || "10000");

function normalizeUrl(input) {
  try {
    return new URL(input, BASE_URL).toString();
  } catch {
    return String(input);
  }
}

function extractFirst(html, regex) {
  const match = regex.exec(html);
  return match?.[1]?.trim();
}

function hasTag(html, regex) {
  return regex.test(html);
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const text = await res.text().catch(() => "");
    return { res, text };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function tryGetSitemapUrls() {
  const sitemapUrl = normalizeUrl("/sitemap.xml");
  const { res, text } = await fetchText(sitemapUrl);
  if (!res.ok) return { sitemapUrl, urls: [] };

  // Very small/lightweight parser for <loc>...</loc>
  const locRegex = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  const urls = [];
  let m;
  while ((m = locRegex.exec(text))) {
    urls.push(m[1]);
  }
  return { sitemapUrl, urls };
}

async function checkPage(url) {
  const normalized = normalizeUrl(url);
  console.log(`\nAnalyzing ${normalized}...`);

  const { res, text: html } = await fetchText(normalized);

  const result = {
    url: normalized,
    status: res.status,
    ok: res.ok,
    checks: {
      title: null,
      description: null,
      canonical: null,
      robots: null,
      hasH1: false,
      hasJsonLd: false,
    },
    errors: [],
  };

  if (!res.ok) {
    result.errors.push(`HTTP ${res.status}`);
    return result;
  }

  // Title
  result.checks.title =
    extractFirst(html, /<title[^>]*>([^<]*)<\/title>/i) || null;
  if (!result.checks.title) result.errors.push("Missing <title>");

  // Meta description
  result.checks.description =
    extractFirst(
      html,
      /<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i
    ) || null;
  if (!result.checks.description)
    result.errors.push("Missing meta description");

  // Canonical
  result.checks.canonical =
    extractFirst(
      html,
      /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i
    ) || null;
  if (!result.checks.canonical) result.errors.push("Missing canonical link");

  // Robots meta (optional)
  result.checks.robots =
    extractFirst(
      html,
      /<meta\s+[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i
    ) || null;

  // H1 presence
  result.checks.hasH1 = hasTag(html, /<h1\b[^>]*>/i);
  if (!result.checks.hasH1) result.errors.push("Missing <h1>");

  // Structured data (JSON-LD)
  result.checks.hasJsonLd = hasTag(
    html,
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>/i
  );

  return result;
}

function writeArtifacts(summary) {
  fs.writeFileSync("seo-audit.json", JSON.stringify(summary, null, 2));

  const lines = [];
  lines.push(`# SEO Audit`);
  lines.push("");
  lines.push(`Base URL: ${summary.baseUrl}`);
  if (summary.sitemapUrl) lines.push(`Sitemap: ${summary.sitemapUrl}`);
  lines.push("");
  lines.push(`Checked: ${summary.results.length}`);
  lines.push(
    `Failed: ${summary.results.filter((r) => r.errors.length > 0).length}`
  );
  lines.push("");

  for (const r of summary.results) {
    const status = r.errors.length ? "FAIL" : "PASS";
    lines.push(`- ${status} ${r.status} ${r.url}`);
    if (r.errors.length) lines.push(`  - ${r.errors.join("; ")}`);
  }

  fs.writeFileSync("seo-audit.md", lines.join("\n"));
}

async function run() {
  let urls = [];
  let sitemapUrl = null;

  try {
    const sitemap = await tryGetSitemapUrls();
    sitemapUrl = sitemap.sitemapUrl;
    if (sitemap.urls.length > 0) {
      // sample first N deterministically
      urls = sitemap.urls.slice(0, SAMPLE_SIZE);
    }
  } catch {
    // ignore sitemap failures; fall back
  }

  if (urls.length === 0) {
    urls = [normalizeUrl("/"), normalizeUrl("/en")];
  }

  const results = [];
  let failed = false;

  for (const url of urls) {
    try {
      const r = await checkPage(url);
      results.push(r);
      if (r.errors.length) failed = true;
    } catch (e) {
      results.push({
        url: normalizeUrl(url),
        status: 0,
        ok: false,
        checks: {},
        errors: [e instanceof Error ? e.message : String(e)],
      });
      failed = true;
    }
  }

  const summary = {
    baseUrl: BASE_URL,
    sitemapUrl,
    sampleSize: SAMPLE_SIZE,
    results,
  };

  writeArtifacts(summary);

  if (failed) {
    console.error("\nSEO audit FAILED");
    process.exit(1);
  }

  console.log("\nSEO audit PASSED");
}

run();
