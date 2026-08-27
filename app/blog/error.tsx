'use client'
import { useEffect } from "react";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Blog section error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/20">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        </svg>
      </div>

      <h2 className="bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-2xl font-bold text-transparent dark:from-rose-400 dark:to-orange-400">
        内容加载失败
      </h2>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">
        可能是网络问题，请尝试刷新
      </p>

      <button
        onClick={reset}
        className="mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/30"
      >
        重试
      </button>
    </div>
  )
}
