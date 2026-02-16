interface DarkModeSwitchProps {
  checked: boolean;
  onChange: () => void;
  size?: number;
  style?: React.CSSProperties;
}

export function DarkModeSwitch({
  checked,
  onChange,
  size = 24,
  style
}: DarkModeSwitchProps) {
  return (
    <button
      type="button"
      aria-label={checked ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={onChange}
      className="rounded-full p-1 text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
      style={style}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {checked ? (
          <>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </>
        ) : (
          <>
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </>
        )}
      </svg>
    </button>
  );
}
