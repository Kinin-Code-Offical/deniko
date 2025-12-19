// scripts/ci/cache-audit.mjs
// Node.js 18+ has global fetch, so no need to import undici unless on older node
// import { fetch } from 'undici';

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const PATHS = ["/", "/en"]; // Add more paths as needed

async function checkUrl(path) {
  const url = new URL(path, BASE_URL).toString();
  console.log(`\nChecking ${url}...`);

  const errors = [];

  // First request
  const res1 = await fetch(url);
  const headers1 = res1.headers;

  // Second request
  const res2 = await fetch(url);
  const headers2 = res2.headers;

  // Check Cache-Control
  const cacheControl = headers1.get("cache-control");
  if (!cacheControl) {
    errors.push("Missing Cache-Control header");
  } else {
    console.log(`  Cache-Control: ${cacheControl}`);
  }

  // Check ETag
  const etag1 = headers1.get("etag");
  const etag2 = headers2.get("etag");
  if (!etag1) {
    errors.push("Missing ETag header");
  } else if (etag1 !== etag2) {
    errors.push("ETag changed between requests (unstable)");
  } else {
    console.log(`  ETag: ${etag1}`);
  }

  // Check Age (if applicable)
  const age1 = headers1.get("age");
  const age2 = headers2.get("age");
  if (age1 && age2) {
    console.log(`  Age: ${age1} -> ${age2}`);
    if (parseInt(age2) <= parseInt(age1)) {
      // This might not be an error if requests are very close, but usually age increases
      // errors.push('Age did not increase');
    }
  }

  // Check X-Cache or CF-Cache-Status if present
  const xCache = headers1.get("x-cache") || headers1.get("cf-cache-status");
  if (xCache) {
    console.log(`  Cache Status: ${xCache}`);
  }

  if (errors.length > 0) {
    console.error("  FAIL:");
    errors.forEach((e) => console.error(`    - ${e}`));
    return false;
  } else {
    console.log("  PASS");
    return true;
  }
}

async function run() {
  let failed = false;
  for (const path of PATHS) {
    try {
      const ok = await checkUrl(path);
      if (!ok) failed = true;
    } catch (e) {
      console.error(`Error checking ${path}:`, e);
      failed = true;
    }
  }

  if (failed) {
    console.error("\nCache audit FAILED");
    process.exit(1);
  } else {
    console.log("\nCache audit PASSED");
  }
}

run();
