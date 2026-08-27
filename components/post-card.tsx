import Link from "next/link";
import type { PostMeta } from "@/lib/content";
import { TagPill } from "@/components/tag-pill";

/** 普通卡片：用于列表页与首页的次要位置 */
export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:shadow-black/40">
      {/* 悬停时浮现的高光描边 */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-transparent to-violet-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-400/5 dark:to-violet-400/5" />

      {/*
       * 覆盖整卡的点击区。必须是 article 的直接子元素，否则 inset-0 只撑满
       * 内部容器，卡片的 padding 边沿点不到。读屏以 h2 里的链接为准。
       */}
      <Link
        href={`/blog/${post.slug}`}
        aria-hidden
        tabIndex={-1}
        className="absolute inset-0 z-10"
      />

      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
        <time dateTime={post.date} className="font-medium tabular-nums">
          {post.date}
        </time>
        <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        <span>{post.readingMinutes} 分钟</span>
        {post.draft && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            草稿
          </span>
        )}
      </div>

      <h2 className="mt-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        <Link href={`/blog/${post.slug}`}>
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text transition-colors duration-300 group-hover:text-transparent dark:from-blue-400 dark:to-violet-400">
            {post.title}
          </span>
        </Link>
      </h2>

      {post.description && (
        <p className="mt-2 line-clamp-2 leading-relaxed text-zinc-600 dark:text-zinc-400">
          {post.description}
        </p>
      )}

      {post.tags.length > 0 && (
        <div className="relative z-20 mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}

/** 主推卡片：首页最新一篇，尺寸与视觉重量都更大 */
export function FeaturedPostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white via-white to-zinc-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-200/60 sm:p-10 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 dark:hover:shadow-black/50">
      {/* 右上角装饰光斑 */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/20 to-violet-400/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80 dark:from-blue-500/10 dark:to-violet-500/10" />

      {/*
       * 覆盖整卡的点击区。必须是 article 的直接子元素：下面内容区是 relative，
       * 放在里面的话 inset-0 只会撑满内容区，卡片的 p-8 内边距点不到。
       * 无障碍上以 h2 里的链接为准，这层对读屏隐藏。
       */}
      <Link
        href={`/blog/${post.slug}`}
        aria-hidden
        tabIndex={-1}
        className="absolute inset-0 z-10"
      />

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-2.5 py-1 font-semibold text-white shadow-sm">
            最新
          </span>
          <time
            dateTime={post.date}
            className="font-medium tabular-nums text-zinc-600 dark:text-zinc-400"
          >
            {post.date}
          </time>
          <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="text-zinc-600 dark:text-zinc-400">
            {post.readingMinutes} 分钟
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          <Link href={`/blog/${post.slug}`}>
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text transition-colors duration-300 group-hover:text-transparent dark:from-blue-400 dark:to-violet-400">
              {post.title}
            </span>
          </Link>
        </h2>

        {post.description && (
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {post.description}
          </p>
        )}

        <div className="relative z-20 mt-6 flex flex-wrap items-center gap-2">
          {post.tags.map((tag) => (
            <TagPill key={tag} tag={tag} size="md" />
          ))}
        </div>
      </div>
    </article>
  );
}
