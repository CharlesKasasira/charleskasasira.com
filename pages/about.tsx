import Container from "components/Container";

const skills = [
  "Frontend engineering",
  "Product design systems",
  "TypeScript + Next.js",
  "API integrations",
  "Technical writing",
  "Developer education",
];

const timeline = [
  { org: "RENU", role: "Software Engineer | DevOps", date: "Present" },
  { org: "RENU", role: "Intern", date: "Aug 2023" },
  { org: "Ablestate", role: "Frontend Developer", date: "May 2023" },
  { org: "WHD", role: "Graphics Designer", date: "Sept 2020" },
  { org: "Byte Of Hope", role: "Founding Member", date: "June 2019" },
];

const certifications = [
  { title: "Machine Learning with Python", issuer: "freeCodeCamp" },
  { title: "Introduction to Generative AI", issuer: "Google Cloud Skill Boost" },
  { title: "Introduction to Machine Learning", issuer: "Kaggle" },
  { title: "Front-End Development Libraries", issuer: "freeCodeCamp" },
  { title: "Full-Stack Web Development", issuer: "Ablestate" },
  { title: "Mobile App Development with Flutter", issuer: "GDSC MUK" },
];

const links = [
  { label: "GitHub", value: "@charleskasasira", href: "https://github.com/charleskasasira" },
  {
    label: "LinkedIn",
    value: "charleskasasira",
    href: "https://www.linkedin.com/in/charleskasasira/",
  },
  {
    label: "YouTube",
    value: "@charleskasasira",
    href: "https://youtube.com/@charleskasasira",
  },
];

export default function About() {
  return (
    <Container
      title="About | Charles Kasasira"
      description="Background, skills, and experience for Charles Kasasira."
    >
      <div className="studio-page">
        <header className="grid gap-10 pb-[14vh] lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.7fr)] lg:items-end">
          <div>
            <p className="studio-page-kicker mb-5">About</p>
            <h1 className="studio-page-title">
              Building useful things, carefully.
            </h1>
          </div>
          <p className="max-w-xl text-xl leading-8 tracking-[-0.01em] text-[var(--site-muted)]">
            I am a software designer and developer based in Kampala, Uganda. I
            turn ideas into scalable products, then document the process so
            others can build with fewer mistakes.
          </p>
        </header>

        <section className="grid gap-12 border-t border-[var(--site-rule)] py-[10vh] lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="studio-page-kicker">What I work with</p>
            <h2 className="mt-4 max-w-md text-[clamp(2rem,4vw,4rem)] font-medium leading-[1.04] tracking-[-0.025em]">
              Design judgment with engineering depth.
            </h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8">
            {skills.map((skill, index) => (
              <li
                key={skill}
                className="flex items-baseline gap-5 border-b border-[var(--site-rule)] py-4"
              >
                <span className="text-xs text-[var(--site-muted)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-xl font-medium tracking-[-0.015em]">{skill}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="py-[10vh]">
          <div className="studio-section-heading">
            <h2>Experience</h2>
            <b>Where I have worked</b>
          </div>
          <ol>
            {timeline.map((item, index) => (
              <li
                key={item.org + item.role}
                className="grid gap-3 border-b border-[var(--site-rule)] py-5 sm:grid-cols-[3.75rem_1fr_1fr_auto] sm:items-baseline sm:gap-5"
              >
                <span className="text-sm text-[var(--site-muted)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong className="text-2xl font-medium tracking-[-0.02em]">
                  {item.org}
                </strong>
                <span className="text-[var(--site-muted)]">{item.role}</span>
                <span className="studio-caption">{item.date}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-[10vh]">
          <div className="studio-section-heading">
            <h2>Certifications</h2>
            <b>Continued learning</b>
          </div>
          <ul className="grid gap-x-8 md:grid-cols-2">
            {certifications.map((cert) => (
              <li
                key={cert.title}
                className="border-b border-[var(--site-rule)] py-5"
              >
                <p className="text-lg font-medium tracking-[-0.012em]">{cert.title}</p>
                <p className="mt-1 text-sm text-[var(--site-muted)]">{cert.issuer}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="py-[10vh]">
          <div className="studio-section-heading">
            <h2>Elsewhere</h2>
            <b>Find me online</b>
          </div>
          <div>
            {links.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-row"
              >
                <span className="studio-row-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{link.label}</strong>
                <span className="studio-row-description">{link.value}</span>
                <span className="studio-row-action">Visit ↗</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
