import Link from 'next/link';

const ExternalLink = ({ href, children }) => (
  <a
    className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    target="_blank"
    rel="noopener noreferrer"
    href={href}
  >
    {children}
  </a>
);

export default function Footer() {
  return (
    <footer className="mb-8 mt-20 flex flex-col items-start justify-center">
      <hr className="mb-8 w-full border-1 border-zinc-200 dark:border-zinc-800" />
      <div className="grid w-full grid-cols-1 gap-8 pb-10 sm:grid-cols-3">
        <div className="flex flex-col space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
            Explore
          </p>
          <Link href="/">
            <span className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Home
            </span>
          </Link>
          <Link href="/about">
            <span className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              About
            </span>
          </Link>
          <Link href="/projects">
            <span className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Projects
            </span>
          </Link>
        </div>
        <div className="flex flex-col space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
            Social
          </p>
          <ExternalLink href="https://twitter.com/kasasirac">
            Twitter
          </ExternalLink>
          <ExternalLink href="https://github.com/charleskasasira">GitHub</ExternalLink>
          <ExternalLink href="https://www.youtube.com/charleskasasira">
            YouTube
          </ExternalLink>
        </div>
        <div className="flex flex-col space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
            More
          </p>
          <Link href="/projects">
            <span className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Snippets
            </span>
          </Link>
          <ExternalLink href="https://blog.charleskasasira.me">Blog</ExternalLink>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          &copy; <span>{new Date().getFullYear()}</span> Charles Kasasira
        </p>
      </div>
    </footer>
  );
}
