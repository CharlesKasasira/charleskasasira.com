export type BlogPostSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  cover: string;
  originalUrl: string;
  readingMinutes: number;
};

export type BlogPost = BlogPostSummary & {
  content: string;
};

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
