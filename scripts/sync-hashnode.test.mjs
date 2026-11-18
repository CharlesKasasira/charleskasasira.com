import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import matter from "gray-matter";
import { activateStagedImport, main } from "./sync-hashnode.mjs";

const publicationUrl = "https://blog.example.com";

function postHtml({ title, published = "2026-01-02T03:04:05.000Z" }) {
  return `<script type="application/ld+json">${JSON.stringify({
    "@type": "BlogPosting",
    headline: title,
    description: `${title} description`,
    datePublished: published,
    dateModified: published,
    image: { url: "https://images.example.com/cover.png" },
  })}</script>`;
}

function createFetch(responses) {
  return async (url) => {
    const response = responses.get(url);
    if (!response) return new Response("Not found", { status: 404 });
    return new Response(response.body, {
      status: response.status ?? 200,
      headers: { "content-type": response.contentType ?? "text/plain" },
    });
  };
}

async function createFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "hashnode-import-test-"));
  const outputDirectory = path.join(root, "content", "blog");
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, "existing.md"), "existing blog content\n");
  return { root, outputDirectory };
}

test("stages, validates, and swaps a complete import", async () => {
  const fixture = await createFixture();
  const responses = new Map([
    [
      `${publicationUrl}/sitemap.xml`,
      {
        body: `<urlset><url><loc>${publicationUrl}/second-post</loc></url><url><loc>${publicationUrl}/first-post</loc></url></urlset>`,
      },
    ],
    [`${publicationUrl}/first-post`, { body: postHtml({ title: "First post" }) }],
    [`${publicationUrl}/first-post.md`, { body: "# First post\n\nFirst body." }],
    [`${publicationUrl}/second-post`, { body: postHtml({ title: "Second post" }) }],
    [`${publicationUrl}/second-post.md`, { body: "# Second post\n\nSecond body." }],
  ]);

  try {
    await main({
      publicationUrl,
      outputDirectory: fixture.outputDirectory,
      fetchImpl: createFetch(responses),
      log() {},
      warn() {},
    });

    assert.deepEqual(await readdir(fixture.outputDirectory), ["first-post.md", "second-post.md"]);
    const imported = matter(
      await readFile(path.join(fixture.outputDirectory, "first-post.md"), "utf8"),
    );
    assert.equal(imported.data.title, "First post");
    assert.equal(imported.content.trim(), "First body.");
    assert.deepEqual(await readdir(path.dirname(fixture.outputDirectory)), ["blog"]);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("preserves the current blog when any download fails", async () => {
  const fixture = await createFixture();
  const responses = new Map([
    [
      `${publicationUrl}/sitemap.xml`,
      {
        body: `<urlset><url><loc>${publicationUrl}/good-post</loc></url><url><loc>${publicationUrl}/broken-post</loc></url></urlset>`,
      },
    ],
    [`${publicationUrl}/good-post`, { body: postHtml({ title: "Good post" }) }],
    [`${publicationUrl}/good-post.md`, { body: "# Good post\n\nGood body." }],
    [`${publicationUrl}/broken-post`, { body: postHtml({ title: "Broken post" }) }],
    [`${publicationUrl}/broken-post.md`, { body: "Unavailable", status: 503 }],
  ]);

  try {
    await assert.rejects(
      main({
        publicationUrl,
        outputDirectory: fixture.outputDirectory,
        fetchImpl: createFetch(responses),
        log() {},
        warn() {},
      }),
      /Failed to import 1 post/,
    );

    assert.deepEqual(await readdir(fixture.outputDirectory), ["existing.md"]);
    assert.equal(
      await readFile(path.join(fixture.outputDirectory, "existing.md"), "utf8"),
      "existing blog content\n",
    );
    assert.deepEqual(await readdir(path.dirname(fixture.outputDirectory)), ["blog"]);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("preserves the current blog when staged metadata is invalid", async () => {
  const fixture = await createFixture();
  const responses = new Map([
    [
      `${publicationUrl}/sitemap.xml`,
      { body: `<urlset><url><loc>${publicationUrl}/invalid-post</loc></url></urlset>` },
    ],
    [
      `${publicationUrl}/invalid-post`,
      { body: postHtml({ title: "Invalid post", published: "not-a-date" }) },
    ],
    [`${publicationUrl}/invalid-post.md`, { body: "# Invalid post\n\nBody." }],
  ]);

  try {
    await assert.rejects(
      main({
        publicationUrl,
        outputDirectory: fixture.outputDirectory,
        fetchImpl: createFetch(responses),
        log() {},
        warn() {},
      }),
      /Failed to import 1 post/,
    );

    assert.deepEqual(await readdir(fixture.outputDirectory), ["existing.md"]);
    assert.deepEqual(await readdir(path.dirname(fixture.outputDirectory)), ["blog"]);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("restores the current blog when activation fails", async () => {
  const fixture = await createFixture();
  const workspaceDirectory = path.join(path.dirname(fixture.outputDirectory), ".swap-test");
  const swapState = { backupDirectory: null, preserveWorkspace: false };
  await mkdir(workspaceDirectory);

  try {
    await assert.rejects(
      activateStagedImport(
        path.join(workspaceDirectory, "missing-staged-directory"),
        fixture.outputDirectory,
        workspaceDirectory,
        swapState,
        () => {},
      ),
      /ENOENT/,
    );

    assert.deepEqual(await readdir(fixture.outputDirectory), ["existing.md"]);
    assert.equal(swapState.backupDirectory, null);
    assert.deepEqual(await readdir(workspaceDirectory), []);
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});
