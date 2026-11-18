import Container from "components/Container";
import { getAllPosts } from "lib/blog";
import type { BlogPostSummary } from "lib/blog-shared";
import { formatPostDate } from "lib/blog-shared";
import type { GetStaticProps } from "next";
import Link from "next/link";

type BlogPageProps = {
  posts: BlogPostSummary[];
};

export default function Blog({ posts }: BlogPageProps) {
  const postsByYear = posts.reduce<Record<string, BlogPostSummary[]>>(
    (groups, post) => {
      const year = new Date(post.date).getUTCFullYear().toString();
      groups[year] ??= [];
      groups[year].push(post);
      return groups;
    },
    {},
  );
  const postsByNewestYear = Object.entries(postsByYear).sort(
    ([yearA], [yearB]) => Number(yearB) - Number(yearA),
  );

  return (
    <Container
      title="Writing — Charles Kasasira"
      description="Notes from Charles Kasasira on software, systems, and the things he is learning."
    >
      <div className="mx-auto w-full max-w-5xl pb-8 pt-[8vh]">
        <header className="mb-16 max-w-3xl">
          <p className="studio-page-kicker mb-5">
            Writing
          </p>
          <h1 className="editorial-title">
            Notes on software, systems, and the things I&apos;m learning.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--site-muted)]">
            Practical tutorials, working notes, and ideas collected over time.
            All {posts.length} posts now live here with the rest of my work.
          </p>
        </header>

        <div className="space-y-14">
          {postsByNewestYear.map(([year, yearPosts]) => (
            <section key={year} aria-labelledby={`year-${year}`}>
              <h2
                id={`year-${year}`}
                className="studio-label mb-3 border-b border-[var(--site-rule)] pb-3 text-[var(--site-muted)]"
              >
                {year}
              </h2>
              <ol className="divide-y divide-[var(--site-rule)]">
                {yearPosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group grid gap-2 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
                    >
                      <div>
                        <h3 className="text-xl font-medium tracking-[-0.015em] transition group-hover:translate-x-1">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-[var(--site-muted)]">
                          {post.description}
                        </p>
                      </div>
                      <p className="studio-caption whitespace-nowrap">
                        {formatPostDate(post.date)} · {post.readingMinutes} min
                      </p>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </Container>
  );
}

export const getStaticProps = (async () => ({
  props: { posts: getAllPosts() },
})) satisfies GetStaticProps<BlogPageProps>;
