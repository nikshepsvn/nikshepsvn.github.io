// Refresh `stars: N` fields in content.js by hitting the GitHub API.
// Auto-scans each project entry for its first github.com URL — no manual map.

import fs from "node:fs/promises";

const FILE = "content.js";
const src0 = await fs.readFile(FILE, "utf8");

// Carve out the `projects: [ ... ]` block so we only touch it.
const startIdx = src0.search(/^\s*projects:\s*\[/m);
const endIdx = src0.search(/^\s*essays:\s*\[/m);
if (startIdx < 0 || endIdx < 0) {
  console.error("Couldn't locate projects/essays markers in content.js");
  process.exit(1);
}
const before = src0.slice(0, startIdx);
const after = src0.slice(endIdx);
let projectsBlock = src0.slice(startIdx, endIdx);

// Each entry: a `{ id: "P-XX", ... },` block at array level.
const entryRegex = /\{\s*\n\s*id:\s*"P-\d+",[\s\S]*?\n\s{4}\},/g;
const entries = [...projectsBlock.matchAll(entryRegex)].map((m) => m[0]);
console.log(`Found ${entries.length} project entries`);

const headers = {
  "User-Agent": "nikshepsvn-stars-refresh",
  Accept: "application/vnd.github+json",
};
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const changes = [];

for (const entry of entries) {
  const gh = entry.match(/https?:\/\/github\.com\/([^/]+)\/([^/"\s]+)/);
  if (!gh) continue;
  const [, owner, repo] = gh;

  const starsMatch = entry.match(/stars:\s*(\d+|null)/);
  if (!starsMatch) continue;
  const currentStars =
    starsMatch[1] === "null" ? null : parseInt(starsMatch[1], 10);

  const nameMatch = entry.match(/name:\s*"([^"]+)"/);
  const name = nameMatch ? nameMatch[1] : `${owner}/${repo}`;

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
    });
    if (!res.ok) {
      console.log(`skip ${name}: ${res.status}`);
      continue;
    }
    const data = await res.json();
    const fresh = data.stargazers_count;
    if (fresh !== currentStars) {
      console.log(`${name}: ${currentStars} → ${fresh}`);
      const updated = entry.replace(
        /stars:\s*(\d+|null)/,
        `stars: ${fresh}`
      );
      projectsBlock = projectsBlock.replace(entry, updated);
      changes.push({ name, from: currentStars, to: fresh });
    }
  } catch (e) {
    console.error(`fail ${name}: ${e.message}`);
  }
}

if (changes.length > 0) {
  await fs.writeFile(FILE, before + projectsBlock + after);
  console.log(`\nUpdated ${changes.length} repo(s)`);
} else {
  console.log("\nNo star changes");
}
