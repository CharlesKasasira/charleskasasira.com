import cn from 'classnames';
import Link from 'next/link';
import { useEffect, useRef, useState, type SVGProps } from 'react';
import styles from 'styles/mobile-menu.module.css';
import { menuData } from 'utils/menuData';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  function toggleMenu() {
    if (!isMenuOpen) {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : triggerRef.current;
    }

    setIsMenuOpen((open) => !open);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const getFocusableElements = () => {
      const menuElements = menuRef.current
        ? Array.from(
            menuRef.current.querySelectorAll<HTMLElement>(focusableSelector)
          )
        : [];

      return [triggerRef.current, ...menuElements].filter(
        (element): element is HTMLElement =>
          Boolean(element && element.tabIndex !== -1)
      );
    };

    const firstMenuItem = menuRef.current?.querySelector<HTMLElement>(
      focusableSelector
    );
    firstMenuItem?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);
      const activeElement = document.activeElement;

      if (!firstElement || !lastElement) {
        event.preventDefault();
        return;
      }

      if (!focusableElements.includes(activeElement as HTMLElement)) {
        event.preventDefault();
        firstElement.focus();
      } else if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;

      const returnTarget = returnFocusRef.current;
      if (returnTarget?.isConnected) returnTarget.focus();
      returnFocusRef.current = null;
    };
  }, [isMenuOpen]);

  return (
    <>
      <button
        ref={triggerRef}
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
        <MenuIcon aria-hidden="true" focusable="false" data-hide={isMenuOpen} />
        <CrossIcon aria-hidden="true" focusable="false" data-hide={!isMenuOpen} />
      </button>
      {isMenuOpen && (
        <div
          ref={menuRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
          className="site-panel pointer-events-auto fixed inset-x-3 top-[4.5rem] z-[60] flex max-h-[calc(100dvh-5.5rem)] list-none flex-col overflow-y-auto p-3 shadow-2xl backdrop-blur-2xl md:hidden"
        >
          <ul className="list-none">
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
        </div>
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
