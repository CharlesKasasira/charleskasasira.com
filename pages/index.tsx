import Container from "components/Container";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
    icon: <AiFillGithub size={24} />,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/charleskasasira/",
    icon: <AiFillLinkedin size={24} />,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UClhrdUmdjbQi9fMq3R65BVw",
    icon: <AiFillYoutube size={24} />,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/kasasirac",
    icon: <AiOutlineTwitter size={24} />,
  },
];

const focusAreas = [
  {
    title: "Product Engineering",
    description:
      "Building polished web products from concept to deployment with a focus on performance and usability.",
  },
  {
    title: "Creative Development",
    description:
      "Designing visual experiences that feel intentional, fast, and easy to understand on any device.",
  },
  {
    title: "Education Content",
    description:
      "Sharing practical tutorials on YouTube to help developers ship clean and production-ready features.",
  },
];

const featuredWork = [
  {
    name: "Project Showcase",
    description:
      "A curated view of my open-source and client projects with GitHub stats and contribution activity.",
    href: "/projects",
    cta: "View projects",
  },
  {
    name: "Live YouTube Metrics",
    description:
      "A real-time dashboard that tracks channel growth, total views, and uploaded videos.",
    href: "/youtube",
    cta: "Open dashboard",
  },
  {
    name: "Technical Writing",
    description:
      "Hands-on frontend engineering breakdowns and implementation guides published on my blog.",
    href: "https://blog.charleskasasira.com",
    cta: "Read articles",
    external: true,
  },
];

const recentPosts = [
  {
    title: "CSS Art: Instagram Logo with pure CSS",
    date: "May 21, 2022",
    href: "https://blog.charleskasasira.com/css-art-instagram-logo-with-pure-css",
  },
  {
    title: "Cheat sheet: Arrays in JavaScript",
    date: "Jan 22, 2022",
    href: "https://blog.charleskasasira.com/cheat-sheet-arrays-in-javascript",
  },
  {
    title: "HOW TO: Click outside to close in Javascript",
    date: "Jan 18, 2022",
    href: "https://blog.charleskasasira.com/how-to-click-outside-to-close-in-javascript",
  },
];

const videoIds = ["FtpN8QI9PuA", "1czjJGA5dHQ", "DAYoeJgolYg"];

export default function Home() {
  return (
    <Container
      title="Charles Kasasira | Product Engineer and Creator"
      description="Kampala-based software designer and developer building useful digital products and educational content."
    >
      <section className="mb-16">
        <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-[1fr,auto] sm:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-w-0 space-y-6 sm:col-start-1"
          >
            <p className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-50 px-4 py-1 text-xs font-medium tracking-[0.12em] text-amber-900 dark:border-amber-400/40 dark:bg-amber-500/20 dark:text-amber-100">
              SOFTWARE DESIGNER + DEVELOPER
            </p>
            <h1 className="text-4xl font-black leading-tight text-zinc-900 dark:text-zinc-100 md:text-6xl">
              Building practical products, teaching what I learn.
            </h1>
            <p className="max-w-2xl text-lg text-zinc-700 dark:text-zinc-300">
              I am Charles Kasasira, a Kampala-based engineer focused on
              frontend architecture, product design systems, and developer
              education through project-based tutorials.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="primary-cta-text rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100"
              >
                Explore Projects
              </Link>
              <a
                href="https://www.youtube.com/channel/UClhrdUmdjbQi9fMq3R65BVw?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-zinc-300 bg-transparent px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-500 dark:bg-transparent dark:text-zinc-200 dark:hover:border-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                Subscribe on YouTube
              </a>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-zinc-300 p-2 text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-200 dark:hover:text-zinc-100"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex shrink-0 justify-center sm:col-start-2 sm:justify-end"
          >
            <Image
              src="/pole.png"
              alt="Charles Kasasira portrait"
              width={180}
              height={180}
              className="h-[180px] w-[180px] shrink-0 rounded-full object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          What I Focus On
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {focusAreas.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {item.title}
              </h3>
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Featured
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredWork.map((item) => (
            <article
              key={item.name}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {item.name}
              </h3>
              <p className="mb-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
                >
                  {item.cta}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
                >
                  {item.cta}
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mb-8 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Recent Writing
          </h2>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <a
                key={post.href}
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-0.5 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
              >
                <p className="mb-2 text-xs uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                  {post.date}
                </p>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {post.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Latest Tutorials
          </h2>
          <div className="space-y-3">
            {videoIds.map((videoId) => (
              <div
                key={videoId}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <iframe
                  className="aspect-video w-full rounded-xl"
                  loading="lazy"
                  title={`YouTube video ${videoId}`}
                  src={`https://www.youtube.com/embed/${videoId}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
}
