import Link from "next/link";
import {
  AiFillGithub,
  AiFillLinkedin,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/charleskasasira",
    icon: <AiFillGithub size={22} />,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/charleskasasira/",
    icon: <AiFillLinkedin size={22} />,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UClhrdUmdjbQi9fMq3R65BVw",
    icon: <AiFillYoutube size={22} />,
  },
  {
    name: "X / Twitter",
    href: "https://twitter.com/kasasirac",
    icon: <AiOutlineTwitter size={22} />,
  },
];

const footerLinks = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "YouTube", href: "/youtube" },
  { name: "Blog", href: "https://blog.charleskasasira.com", external: true },
  {
    name: "Snippets",
    href: "https://gist.github.com/CharlesKasasira",
    external: true,
  },
];

export default function Footer() {
  return (
    <footer className="mt-12 w-full border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 pb-6 pt-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:pt-12">
          <div>
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-zinc-900 transition hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
            >
              Charles Kasasira
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Building practical products and sharing what I learn along the
              way.
            </p>
          </div>
          <div className="flex items-center gap-1 sm:justify-end">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                title={link.name}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            &copy; <span>{new Date().getFullYear()}</span> Charles Kasasira
          </p>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-3 text-sm sm:justify-end"
          >
            {footerLinks.map((link) =>
              link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </footer>
  );
}
