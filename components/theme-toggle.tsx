"use client";

/**
 * 深色模式开关。
 *
 * 这里刻意不持有任何 React state：主题的唯一来源是 <html> 上的 dark class，
 * 它由 layout 中的内联脚本在首次绘制前打好。图标显示交给 CSS 的 dark: 变体，
 * 因此既不会闪白，也不存在「状态与实际主题不一致」的水合问题。
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // 隐私模式下 localStorage 可能不可写，忽略即可
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="切换深色模式"
      className="rounded-md p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
    >
      <MoonIcon className="block h-5 w-5 dark:hidden" />
      <SunIcon className="hidden h-5 w-5 dark:block" />
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
    </svg>
  );
}
