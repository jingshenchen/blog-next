import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { TagPill } from "@/components/tag-pill";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "关于",
  description: `关于 ${siteConfig.author} 和这个站点。`,
};

export default function AboutPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <Container width="prose" className="py-16">
      <div
        aria-hidden
        className="mb-8 h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
      />

      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="bg-gradient-to-r from-zinc-900 via-blue-800 to-violet-800 bg-clip-text text-transparent dark:from-zinc-50 dark:via-blue-200 dark:to-violet-200">
          关于
        </span>
      </h1>

      {/* 统计卡片 */}
      <dl className="mt-8 flex flex-wrap gap-6">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs font-semibold tracking-widest text-zinc-600 uppercase dark:text-zinc-400">
            文章
          </dt>
          <dd className="mt-0.5 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
            {posts.length}
          </dd>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs font-semibold tracking-widest text-zinc-600 uppercase dark:text-zinc-400">
            标签
          </dt>
          <dd className="mt-0.5 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
            {tags.length}
          </dd>
        </div>
      </dl>

      <div className="prose prose-zinc mt-10 max-w-none dark:prose-invert">
        <p>
          你好，我是 {siteConfig.author}。这里主要记录 Web
          开发中的实践与踩坑过程。
        </p>

        {tags.length > 0 && (
          <>
            <h2>活跃标签</h2>
            <div className="not-prose flex flex-wrap gap-2">
              {tags.map(({ tag, count }) => (
                <TagPill key={tag} tag={tag} count={count} />
              ))}
            </div>
          </>
        )}

        <h2>关于这个站点</h2>
        <ul>
          <li>基于 Next.js 16 App Router 构建</li>
          <li>文章用 MDX 写在仓库里，构建期全量预渲染</li>
          <li>代码高亮由 Shiki 在构建期完成，浏览器不加载高亮库</li>
          <li>内容层与渲染层分离，为将来多端复用预留</li>
        </ul>
      </div>
    </Container>
  );
}