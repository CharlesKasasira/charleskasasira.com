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
    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
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
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-200/80 bg-white/90 py-5 backdrop-blur dark:border-zinc-800 dark:bg-[#151515]/90">
      <a href="#skip" className="skip-nav">
        Skip to content
      </a>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
        >
          CHARLES
        </Link>
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
          onChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          size={25}
        />
      </div>
    </nav>
  );
}

export default Nav;
