import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="relative flex flex-col items-center py-24 text-center">
            {/* 装饰光斑 */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 blur-3xl"
            />

            <p className="bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text text-7xl font-black tracking-tight text-transparent dark:from-blue-400 dark:via-violet-400 dark:to-fuchsia-400">
                404
            </p>
            <h1 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                页面未找到
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                这篇文章可能已被删除，或者链接输错了
            </p>

            <div className="mt-8 flex items-center gap-3">
                <Link
                    href="/"
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/30"
                >
                    返回首页
                </Link>
                <Link
                    href="/blog"
                    className="rounded-xl border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                    浏览全部文章
                </Link>
            </div>
        </div>
    )
}
