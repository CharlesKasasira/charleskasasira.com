import Container from "components/Container";
import Link from "next/link";

function NotFound() {
  return (
    <Container title="404 - Charles Kasasira">
      <div className="studio-page flex min-h-[60vh] w-full flex-col items-start justify-center pb-[10vh]">
        <p className="studio-page-kicker mb-5">Error 404</p>
        <h1 className="studio-page-title max-w-4xl">
          Page not found.
        </h1>
        <p className="mb-10 mt-8 max-w-xl text-lg leading-8 text-[var(--site-muted)]">
          You did not break the internet. This page may have moved, or the link
          may no longer exist.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-full border border-[var(--site-rule)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--site-ink)]"
        >
          Back to home
        </Link>
      </div>
    </Container>
  );
}

export default NotFound;
