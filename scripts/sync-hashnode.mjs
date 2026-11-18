import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const publicationUrl = "https://blog.charleskasasira.com";
const outputDirectory = path.join(process.cwd(), "content", "blog");

function extractPostUrls(sitemap) {
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1])
    .filter((url) => {
      const pathname = new URL(url).pathname;
      return pathname !== "/" && !pathname.startsWith("/page/") && pathname !== "/archive";
    });
}

function extractBlogPosting(html) {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  for (const [, source] of scripts) {
    try {
      const value = JSON.parse(source);
      if (value["@type"] === "BlogPosting") return value;
    } catch {
      // Ignore unrelated or malformed structured-data blocks.
    }
  }

  throw new Error("Could not find BlogPosting metadata");
}

function normalizeMarkdown(markdown, title) {
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return markdown
    .replace(new RegExp(`^#\\s+${escapedTitle}\\s*\\n+`, "i"), "")
    .replace(/(!\[[^\]]*\]\()([^\n)]+?)\s+align="(?:left|center|right)"(\))/g, "$1$2$3")
    .replace(/^%\[(https?:\/\/[^\]]+)\]\s*$/gm, "[Open the embedded media]($1)")
    .trim();
}

function frontmatter(metadata, sourceUrl) {
  const image = metadata.image?.url ?? metadata.image ?? "";

  return [
    "---",
    `title: ${JSON.stringify(metadata.headline)}`,
    `description: ${JSON.stringify(metadata.description ?? "")}`,
    `date: ${JSON.stringify(metadata.datePublished)}`,
    `updated: ${JSON.stringify(metadata.dateModified ?? metadata.datePublished)}`,
    `cover: ${JSON.stringify(image)}`,
    `originalUrl: ${JSON.stringify(sourceUrl)}`,
    "---",
  ].join("\n");
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "charleskasasira.com blog importer" },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  return response.text();
}

async function importPost(url) {
  const slug = new URL(url).pathname.slice(1);
  const [html, markdown] = await Promise.all([
    fetchText(url),
    fetchText(`${url}.md`),
  ]);
  const metadata = extractBlogPosting(html);
  const body = normalizeMarkdown(markdown, metadata.headline);
  const destination = path.join(outputDirectory, `${slug}.md`);

  await writeFile(
    destination,
    `${frontmatter(metadata, url)}\n\n${body}\n`,
    "utf8",
  );

  return { slug, title: metadata.headline };
}

async function main() {
  const sitemap = await fetchText(`${publicationUrl}/sitemap.xml`);
  const urls = extractPostUrls(sitemap);

  await mkdir(outputDirectory, { recursive: true });

  const existingFiles = await readdir(outputDirectory);
  await Promise.all(
    existingFiles
      .filter((file) => file.endsWith(".md"))
      .map((file) => unlink(path.join(outputDirectory, file))),
  );

  const posts = await Promise.all(urls.map(importPost));
  posts
    .sort((a, b) => a.title.localeCompare(b.title))
    .forEach((post) => console.log(`Imported ${post.slug}`));

  console.log(`Imported ${posts.length} posts into content/blog.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
