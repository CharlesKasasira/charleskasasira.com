import Container from "components/Container";
import { getAllPosts, getPostBySlug } from "lib/blog";
import type { BlogPost, BlogPostSummary } from "lib/blog-shared";
import { formatPostDate } from "lib/blog-shared";
import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PostPageProps = {
  post: BlogPost;
  nextPost: BlogPostSummary | null;
};

export default function PostPage({ post, nextPost }: PostPageProps) {
  return (
    <Container
      title={`${post.title} — Charles Kasasira`}
      description={post.description}
      type="article"
      image={post.cover || undefined}
    >
      <article className="mx-auto w-full max-w-3xl pb-8 pt-[8vh]">
        <Link
          href="/blog"
          className="mb-12 inline-flex text-sm font-medium text-[var(--site-muted)] transition hover:text-[var(--site-ink)]"
        >
          ← All writing
        </Link>

        <header className="mb-12">
          <h1 className="editorial-title">
            {post.title}
          </h1>
          <div className="studio-caption mt-6 flex flex-wrap items-center gap-x-2">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
        </header>

        <div className="blog-prose">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...props }) => {
                const external = href?.startsWith("http");
                return (
                  <a
                    href={href}
                    {...props}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <footer className="mt-16 border-t border-[var(--site-rule)] pt-8">
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`} className="group block">
              <span className="text-sm text-[var(--site-muted)]">
                Keep reading
              </span>
              <span className="mt-2 block text-xl font-medium transition group-hover:translate-x-1">
                {nextPost.title} →
              </span>
            </Link>
          ) : (
            <Link
              href="/blog"
              className="font-semibold underline decoration-[var(--site-rule)] underline-offset-4 hover:decoration-current"
            >
              Browse all writing →
            </Link>
          )}
        </footer>
      </article>
    </Container>
  );
}

export const getStaticPaths = (async () => ({
  paths: getAllPosts().map((post) => ({ params: { slug: post.slug } })),
  fallback: false,
})) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const post = getPostBySlug(slug);

  if (!post) return { notFound: true };

  const posts = getAllPosts();
  const postIndex = posts.findIndex((candidate) => candidate.slug === slug);
  const nextPost = posts[postIndex + 1] ?? null;

  return { props: { post, nextPost } };
}) satisfies GetStaticProps<PostPageProps>;
