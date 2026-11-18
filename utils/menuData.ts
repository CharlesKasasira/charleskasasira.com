export type MenuItem = {
  text: string;
  href: string;
  external?: boolean;
};

export const menuData: MenuItem[] = [
  {
    text: "Charles",
    href: "/",
  },
  {
    text: "About",
    href: "/about",
  },
  {
    text: "Projects",
    href: "/projects",
  },
  {
    text: "Writing",
    href: "/blog",
  },
  {
    text: "YouTube",
    href: "/youtube",
  },
];
