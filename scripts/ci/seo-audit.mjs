// scripts/ci/seo-audit.mjs
// Node.js 18+ has global fetch
// import { fetch } from 'undici';
import { JSDOM } from "jsdom";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function checkPage(url) {
  console.log(`\nAnalyzing ${url}...`);
  const res = await fetch(url);

  if (res.status >= 400) {
    console.error(`  FAIL: Status ${res.status}`);
    return false;
  }

  const html = await res.text();
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const errors = [];

  // 1. Title
  const title = doc.querySelector("title");
  if (!title || !title.textContent.trim()) {
    errors.push("Missing <title>");
  } else {
    console.log(`  Title: ${title.textContent.trim()}`);
  }

  // 2. Meta Description
  const metaDesc = doc.querySelector('meta[name="description"]');
  if (!metaDesc || !metaDesc.content.trim()) {
    errors.push("Missing meta description");
  }

  // 3. Canonical
  const canonical = doc.querySelector('link[rel="canonical"]');
  if (!canonical || !canonical.href) {
    errors.push("Missing canonical link");
  } else {
    console.log(`  Canonical: ${canonical.href}`);
  }

  // 4. Robots
  const robots = doc.querySelector('meta[name="robots"]');
  if (robots) {
    console.log(`  Robots: ${robots.content}`);
  }

  // 5. H1
  const h1 = doc.querySelector("h1");
  if (!h1) {
    errors.push("Missing <h1> tag");
  }

  if (errors.length > 0) {
    console.error("  FAIL:");
    errors.forEach((e) => console.error(`    - ${e}`));
    return false;
  }

  console.log("  PASS");
  return true;
}

async function run() {
  // In a real scenario, we might parse sitemap.xml
  // For now, we check homepage and a subpage
  const urls = [`${BASE_URL}/`, `${BASE_URL}/en`];

  let failed = false;
  for (const url of urls) {
    try {
      const ok = await checkPage(url);
      if (!ok) failed = true;
    } catch (e) {
      console.error(`Error checking ${url}:`, e);
      failed = true;
    }
  }

  if (failed) {
    console.error("\nSEO audit FAILED");
    process.exit(1);
  } else {
    console.log("\nSEO audit PASSED");
  }
}

run();
