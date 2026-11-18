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
        className={cn(
          styles.burger,
          'visible rounded-full bg-[var(--site-surface)] text-[var(--site-ink)] backdrop-blur-xl hover:bg-[var(--site-surface-hover)] md:hidden'
        )}
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
          className="site-panel pointer-events-auto fixed inset-x-3 top-[4.5rem] z-[60] flex max-h-[calc(100dvh-5.5rem)] list-none flex-col overflow-y-auto p-3 shadow-2xl backdrop-blur-2xl md:hidden"
        >
          {menuData.map((item) => (
            <li
              key={item.text}
              className="border-b border-[var(--site-rule)] text-base font-medium text-[var(--site-ink)] last:border-0"
            >
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="flex w-full rounded-xl px-3 py-4 transition hover:bg-[var(--site-surface)]"
                >
                  {item.text}
                </a>
              ) : (
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="flex w-full rounded-xl px-3 py-4 transition hover:bg-[var(--site-surface)]"
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
      className="absolute h-5 w-5 text-[var(--site-ink)]"
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
      className="absolute h-5 w-5 text-[var(--site-ink)]"
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
