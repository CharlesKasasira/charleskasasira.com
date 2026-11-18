import Link from "next/link";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/charleskasasira",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/charleskasasira/",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UClhrdUmdjbQi9fMq3R65BVw",
  },
  {
    name: "X / Twitter",
    href: "https://twitter.com/kasasirac",
  },
];

const footerLinks = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "YouTube", href: "/youtube" },
  { name: "Blog", href: "/blog" },
  {
    name: "Snippets",
    href: "https://gist.github.com/CharlesKasasira",
    external: true,
  },
];

export default function Footer() {
  return (
    <footer className="site-gutter mt-[18vh] w-full">
      <div className="flex flex-col gap-6 border-t border-[var(--site-rule)] py-5 text-sm text-[var(--site-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Charles Kasasira</p>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-3">
          {footerLinks.map((link) =>
            link.external ? (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[var(--site-ink)]"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="transition hover:text-[var(--site-ink)]"
              >
                {link.name}
              </Link>
            )
          )}
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[var(--site-ink)]"
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>
      <Link
        href="/"
        aria-label="Charles Kasasira home"
        className="footer-wordmark overflow-hidden pb-3 text-[var(--site-ink)]"
      >
        <span>CHARLES</span>
        <span>KASASIRA</span>
      </Link>
    </footer>
  );
}
