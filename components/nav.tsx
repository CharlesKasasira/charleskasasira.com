import MobileMenu from "./MobileMenu";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { menuData } from "utils/menuData";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

function NavItem({
  href,
  text,
  external,
}: {
  href: string;
  text: string;
  external?: boolean;
}) {
  const router = useRouter();
  const isActive =
    !external &&
    (router.asPath === href ||
      (href !== "/" && router.asPath.startsWith(`${href}/`)));
  const baseClasses =
    "inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition-[background-color,color,padding] duration-300 ease-out hover:px-5";
  const activeClasses = isActive
    ? "nav-item-active"
    : "bg-[var(--site-surface)] text-[var(--site-ink)] backdrop-blur-xl hover:bg-[var(--site-surface-hover)]";

  if (external) {
    return (
      <li className="hidden md:inline-block">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseClasses} ${activeClasses}`}
        >
          {text}
        </a>
      </li>
    );
  }
  return (
    <li className="hidden md:inline-block">
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={`${baseClasses} ${activeClasses}`}
      >
        {text}
      </Link>
    </li>
  );
}

function Nav() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <nav className="pointer-events-none fixed inset-x-0 top-4 z-50 w-full">
      <div className="site-gutter flex w-full items-center justify-between gap-3">
        <a href="#skip" className="skip-nav">
          Skip to content
        </a>

        <div className="pointer-events-auto flex min-w-0 items-center gap-2">
          <MobileMenu />
          <ul className="flex items-center gap-2">
            {menuData.map((menu) => (
              <NavItem
                href={menu.href}
                text={menu.text}
                external={menu.external}
                key={menu.text}
              />
            ))}
          </ul>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <Link
            href="/projects"
            className="hidden h-11 items-center gap-2 rounded-full bg-[var(--site-surface)] px-4 text-sm font-medium text-[var(--site-ink)] backdrop-blur-xl transition hover:bg-[var(--site-surface-hover)] lg:inline-flex"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-600 ring-4 ring-emerald-600/10" />
            View projects
          </Link>
          <DarkModeSwitch
            style={{ marginBottom: "0" }}
            checked={resolvedTheme === "dark"}
            onChange={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            size={20}
          />
        </div>
      </div>
    </nav>
  );
}

export default Nav;
