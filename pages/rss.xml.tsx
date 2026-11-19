import { getAllPosts } from "lib/blog";
import type { GetServerSideProps } from "next";

const siteUrl = "https://charleskasasira.com";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function generateRssFeed() {
  const posts = getAllPosts();
  const lastBuildDate = posts[0]?.updated ?? new Date().toISOString();
  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Charles Kasasira</title>
    <link>${siteUrl}/blog</link>
    <description>Notes from Charles Kasasira on software, systems, and the things he is learning.</description>
    <language>en</language>
    <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );
  res.write(generateRssFeed());
  res.end();

  return { props: {} };
};

export default function RssFeed() {
  return null;
}
