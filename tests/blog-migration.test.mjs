import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const nextConfig = require("../next.config.js");
const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const postsDirectory = path.join(testDirectory, "..", "content", "blog");

const expectedSlugs = fs
  .readdirSync(postsDirectory)
  .filter((fileName) => fileName.endsWith(".md"))
  .filter((fileName) =>
    fs
      .readFileSync(path.join(postsDirectory, fileName), "utf8")
      .includes('originalUrl: "https://blog.charleskasasira.com/'),
  )
  .map((fileName) => fileName.replace(/\.md$/, ""))
  .sort();

test("every migrated Hashnode article has an exact permanent redirect", async () => {
  const redirects = await nextConfig.redirects();

  for (const slug of expectedSlugs) {
    const redirect = redirects.find((candidate) => candidate.source === `/${slug}`);

    assert.ok(redirect, `Missing redirect for ${slug}`);
    assert.equal(
      redirect.destination,
      `https://charleskasasira.com/blog/${slug}`,
    );
    assert.equal(redirect.permanent, true);
    assert.deepEqual(redirect.has, [
      { type: "host", value: "blog.charleskasasira.com" },
    ]);
  }

  const articleRedirects = redirects.filter((redirect) =>
    expectedSlugs.includes(redirect.source.slice(1)),
  );
  assert.equal(articleRedirects.length, expectedSlugs.length);
});

test("legacy blog utility routes redirect to working portfolio routes", async () => {
  const redirects = await nextConfig.redirects();
  const expectedRoutes = new Map([
    ["/", "https://charleskasasira.com/blog"],
    ["/archive", "https://charleskasasira.com/blog"],
    ["/sitemap.xml", "https://charleskasasira.com/sitemap.xml"],
    ["/rss.xml", "https://charleskasasira.com/rss.xml"],
  ]);

  for (const [source, destination] of expectedRoutes) {
    const redirect = redirects.find((candidate) => candidate.source === source);

    assert.ok(redirect, `Missing redirect for ${source}`);
    assert.equal(redirect.destination, destination);
    assert.equal(redirect.permanent, true);
    assert.deepEqual(redirect.has, [
      { type: "host", value: "blog.charleskasasira.com" },
    ]);
  }
});
