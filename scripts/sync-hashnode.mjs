import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";

const defaultPublicationUrl = "https://blog.charleskasasira.com";
const defaultOutputDirectory = path.join(process.cwd(), "content", "blog");

function extractPostUrls(sitemap) {
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].trim())
    .filter((url) => {
      const pathname = new URL(url).pathname;
      return pathname !== "/" && !pathname.startsWith("/page/") && pathname !== "/archive";
    });
}

function describePosts(urls, publicationUrl) {
  if (urls.length === 0) {
    throw new Error("The publication sitemap did not contain any posts");
  }

  const publicationOrigin = new URL(publicationUrl).origin;
  const slugs = new Set();

  return urls.map((url) => {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

    if (parsedUrl.origin !== publicationOrigin) {
      throw new Error(`Refusing to import a post from another origin: ${url}`);
    }

    if (parsedUrl.search || parsedUrl.hash || pathSegments.length !== 1) {
      throw new Error(`Invalid post URL in the publication sitemap: ${url}`);
    }

    const slug = decodeURIComponent(pathSegments[0]);
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(slug) || slug === "." || slug === "..") {
      throw new Error(`Unsafe post slug in the publication sitemap: ${slug}`);
    }

    const normalizedSlug = slug.toLocaleLowerCase("en-US");
    if (slugs.has(normalizedSlug)) {
      throw new Error(`Duplicate post slug in the publication sitemap: ${slug}`);
    }

    slugs.add(normalizedSlug);
    return { slug, url };
  });
}

function extractBlogPosting(html) {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  for (const [, source] of scripts) {
    try {
      const value = JSON.parse(source);
      const candidates = Array.isArray(value) ? value : [value, ...(value["@graph"] ?? [])];
      const posting = candidates.find((candidate) => {
        const types = Array.isArray(candidate?.["@type"])
          ? candidate["@type"]
          : [candidate?.["@type"]];
        return types.includes("BlogPosting");
      });

      if (posting) return posting;
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

function requireText(value, field, sourceUrl) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid ${field} for ${sourceUrl}`);
  }

  return value.trim();
}

function requireDate(value, field, sourceUrl) {
  const date = requireText(value, field, sourceUrl);
  if (Number.isNaN(Date.parse(date))) {
    throw new Error(`Invalid ${field} for ${sourceUrl}`);
  }

  return date;
}

function getCoverUrl(image, sourceUrl) {
  const firstImage = Array.isArray(image) ? image[0] : image;
  const cover = firstImage?.url ?? firstImage ?? "";

  if (cover === "") return "";
  if (typeof cover !== "string") {
    throw new Error(`Invalid image metadata for ${sourceUrl}`);
  }

  const parsedCover = new URL(cover);
  if (!["http:", "https:"].includes(parsedCover.protocol)) {
    throw new Error(`Invalid cover URL for ${sourceUrl}`);
  }

  return cover;
}

function validateMetadata(metadata, sourceUrl) {
  const headline = requireText(metadata.headline, "headline", sourceUrl);
  const description = metadata.description ?? "";

  if (typeof description !== "string") {
    throw new Error(`Invalid description for ${sourceUrl}`);
  }

  return {
    headline,
    description,
    datePublished: requireDate(metadata.datePublished, "datePublished", sourceUrl),
    dateModified: requireDate(
      metadata.dateModified ?? metadata.datePublished,
      "dateModified",
      sourceUrl,
    ),
    cover: getCoverUrl(metadata.image, sourceUrl),
  };
}

function frontmatter(metadata, sourceUrl) {
  return [
    "---",
    `title: ${JSON.stringify(metadata.headline)}`,
    `description: ${JSON.stringify(metadata.description)}`,
    `date: ${JSON.stringify(metadata.datePublished)}`,
    `updated: ${JSON.stringify(metadata.dateModified)}`,
    `cover: ${JSON.stringify(metadata.cover)}`,
    `originalUrl: ${JSON.stringify(sourceUrl)}`,
    "---",
  ].join("\n");
}

async function fetchText(url, fetchImpl) {
  const response = await fetchImpl(url, {
    headers: { "user-agent": "charleskasasira.com blog importer" },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  return response.text();
}

async function importPost(post, stagingDirectory, fetchImpl) {
  const [html, markdown] = await Promise.all([
    fetchText(post.url, fetchImpl),
    fetchText(`${post.url}.md`, fetchImpl),
  ]);
  const metadata = validateMetadata(extractBlogPosting(html), post.url);
  const body = normalizeMarkdown(markdown, metadata.headline);

  if (body === "") {
    throw new Error(`The imported Markdown body is empty for ${post.url}`);
  }

  const destination = path.join(stagingDirectory, `${post.slug}.md`);
  await writeFile(destination, `${frontmatter(metadata, post.url)}\n\n${body}\n`, {
    encoding: "utf8",
    flag: "wx",
  });

  return { ...post, title: metadata.headline };
}

async function validateStagedImport(stagingDirectory, posts) {
  const entries = await readdir(stagingDirectory, { withFileTypes: true });
  const fileNames = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
  const expectedFileNames = posts.map((post) => `${post.slug}.md`).sort();

  if (entries.length !== fileNames.length) {
    throw new Error("The staged import contains an unexpected file or directory");
  }

  if (
    fileNames.length !== expectedFileNames.length ||
    fileNames.some((fileName, index) => fileName !== expectedFileNames[index])
  ) {
    throw new Error("The staged import does not match the publication sitemap");
  }

  await Promise.all(
    posts.map(async (post) => {
      const source = await readFile(path.join(stagingDirectory, `${post.slug}.md`), "utf8");
      const { data, content } = matter(source);

      requireText(data.title, "staged title", post.url);
      requireText(data.date, "staged date", post.url);
      requireText(data.updated, "staged updated date", post.url);
      requireText(data.originalUrl, "staged originalUrl", post.url);
      requireDate(data.date, "staged date", post.url);
      requireDate(data.updated, "staged updated date", post.url);

      if (data.originalUrl !== post.url || content.trim() === "") {
        throw new Error(`Invalid staged post for ${post.url}`);
      }
    }),
  );
}

async function directoryExists(directory) {
  try {
    const stats = await lstat(directory);
    if (!stats.isDirectory()) {
      throw new Error(`Expected a directory at ${directory}`);
    }
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

export async function activateStagedImport(
  stagingDirectory,
  outputDirectory,
  workspaceDirectory,
  swapState,
  warn,
) {
  const backupDirectory = path.join(workspaceDirectory, "previous");

  if (!(await directoryExists(outputDirectory))) {
    await rename(stagingDirectory, outputDirectory);
    return;
  }

  await rename(outputDirectory, backupDirectory);
  swapState.backupDirectory = backupDirectory;

  try {
    await rename(stagingDirectory, outputDirectory);
  } catch (activationError) {
    try {
      await rename(backupDirectory, outputDirectory);
      swapState.backupDirectory = null;
    } catch (rollbackError) {
      swapState.preserveWorkspace = true;
      throw new AggregateError(
        [activationError, rollbackError],
        `Could not activate the import or restore the previous blog. Backup preserved at ${backupDirectory}`,
        { cause: rollbackError },
      );
    }

    throw activationError;
  }

  try {
    await rm(backupDirectory, { recursive: true });
    swapState.backupDirectory = null;
  } catch (error) {
    swapState.preserveWorkspace = true;
    warn(
      `Imported posts are active, but the previous blog backup remains at ${backupDirectory}: ${error.message}`,
    );
  }
}

export async function main({
  publicationUrl = defaultPublicationUrl,
  outputDirectory = defaultOutputDirectory,
  fetchImpl = fetch,
  log = console.log,
  warn = console.warn,
} = {}) {
  const outputParent = path.dirname(outputDirectory);
  await mkdir(outputParent, { recursive: true });

  const workspaceDirectory = await mkdtemp(path.join(outputParent, ".blog-import-"));
  const stagingDirectory = path.join(workspaceDirectory, "staged");
  const swapState = { backupDirectory: null, preserveWorkspace: false };

  try {
    await mkdir(stagingDirectory);
    const sitemap = await fetchText(`${publicationUrl}/sitemap.xml`, fetchImpl);
    const postsToImport = describePosts(extractPostUrls(sitemap), publicationUrl);
    const results = await Promise.allSettled(
      postsToImport.map((post) => importPost(post, stagingDirectory, fetchImpl)),
    );
    const failures = results
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason);

    if (failures.length > 0) {
      throw new AggregateError(failures, `Failed to import ${failures.length} post(s)`);
    }

    const posts = results.map((result) => result.value);
    await validateStagedImport(stagingDirectory, posts);
    await activateStagedImport(
      stagingDirectory,
      outputDirectory,
      workspaceDirectory,
      swapState,
      warn,
    );

    posts
      .sort((a, b) => a.title.localeCompare(b.title))
      .forEach((post) => log(`Imported ${post.slug}`));
    log(`Imported ${posts.length} posts into ${path.relative(process.cwd(), outputDirectory)}.`);

    return posts;
  } finally {
    if (!swapState.preserveWorkspace) {
      await rm(workspaceDirectory, { recursive: true, force: true });
    }
  }
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
