import Container from "components/Container";
import Link from "next/link";

type ErrorPageProps = {
  statusCode: 404 | 500;
  title: string;
  description: string;
};

export default function ErrorPage({
  statusCode,
  title,
  description,
}: ErrorPageProps) {
  return (
    <Container
      title={`${statusCode} — Charles Kasasira`}
      description={description}
      robots="noindex, nofollow"
    >
      <div className="studio-page flex min-h-[60vh] w-full flex-col items-start justify-center pb-[10vh]">
        <p className="studio-page-kicker mb-5">Error {statusCode}</p>
        <h1 className="studio-page-title max-w-4xl">{title}</h1>
        <p className="mb-10 mt-8 max-w-xl text-lg leading-8 text-[var(--site-muted)]">
          {description}
        </p>
        <Link
          href="/"
          className="inline-flex rounded-full border border-[var(--site-rule)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--site-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--site-ink)]"
        >
          Back to home
        </Link>
      </div>
    </Container>
  );
}
