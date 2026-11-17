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
  const isActive = !external && router.asPath === href;
  const baseClasses =
    "rounded-full px-4 py-2 text-sm transition duration-200 hover:-translate-y-0.5";
  const activeClasses = isActive
    ? "primary-cta-text bg-zinc-900 dark:bg-zinc-100"
    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800";

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
      <Link href={href} className={`${baseClasses} ${activeClasses}`}>
        {text}
      </Link>
    </li>
  );
}

function Nav() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/90 py-5 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#skip" className="skip-nav">
          Skip to content
        </a>

        <div className="flex items-center gap-3">
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
        <div>
          <DarkModeSwitch
            style={{ marginBottom: "0" }}
            checked={resolvedTheme === "dark"}
            onChange={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            size={25}
          />
        </div>
      </div>
    </nav>
  );
}

export default Nav;
