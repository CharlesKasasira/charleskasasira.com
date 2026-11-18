import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogPost, BlogPostSummary } from "./blog-shared";

const postsDirectory = path.join(process.cwd(), "content", "blog");

function calculateReadingMinutes(content: string) {
  const words = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_[\](){}|`~-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

function readPostFile(fileName: string): BlogPost {
  const slug = fileName.replace(/\.md$/, "");
  const file = fs.readFileSync(path.join(postsDirectory, fileName), "utf8");
  const { data, content } = matter(file);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    updated: data.updated,
    cover: data.cover,
    originalUrl: data.originalUrl,
    readingMinutes: calculateReadingMinutes(content),
    content,
  };
}

export function getAllPosts(): BlogPostSummary[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(readPostFile)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      updated: post.updated,
      cover: post.cover,
      originalUrl: post.originalUrl,
      readingMinutes: post.readingMinutes,
    }));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const safeSlug = path.basename(slug);
  const fileName = `${safeSlug}.md`;

  if (!fs.existsSync(path.join(postsDirectory, fileName))) return null;
  return readPostFile(fileName);
}
