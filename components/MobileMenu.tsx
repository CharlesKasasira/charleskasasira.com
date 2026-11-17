import cn from 'classnames';
import Link from 'next/link';
import { useState, useEffect, type SVGProps } from 'react';
import styles from 'styles/mobile-menu.module.css';
import { menuData } from 'utils/menuData';

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    } else {
      setIsMenuOpen(true);
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMenu() {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  }

  useEffect(() => {
    return function cleanup() {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      <button
        className={cn(styles.burger, 'visible md:hidden')}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-controls="mobile-navigation"
        aria-expanded={isMenuOpen}
        type="button"
        onClick={toggleMenu}
      >
        <MenuIcon data-hide={isMenuOpen} />
        <CrossIcon data-hide={!isMenuOpen} />
      </button>
      {isMenuOpen && (
        <ul
          id="mobile-navigation"
          className="absolute inset-x-0 top-full z-[60] flex h-[calc(100dvh-81px)] list-none flex-col overflow-y-auto bg-white px-5 py-4 shadow-lg md:hidden dark:bg-zinc-950 sm:px-8"
        >
          {menuData.map((item) => (
            <li
              key={item.text}
              className="border-b border-zinc-200 text-sm font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
            >
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="flex w-full py-4"
                >
                  {item.text}
                </a>
              ) : (
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="flex w-full py-4"
                >
                  {item.text}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="h-5 w-5 absolute text-gray-900 dark:text-gray-100"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M2.5 7.5H17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 12.5H17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="h-5 w-5 absolute text-gray-900 dark:text-gray-100"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      shapeRendering="geometricPrecision"
      {...props}
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}
