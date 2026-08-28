import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAdjacentPosts,
  getPostBySlug,
  getPostHeadings,
  getPublishedPostSlugs,
} from "@/lib/content";
import { TagPill } from "@/components/tag-pill";
import { Toc } from "@/components/toc";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { default: Content } = await import(`@/content/posts/${slug}.mdx`);
  const { prev, next } = getAdjacentPosts(slug);
  const headings = getPostHeadings(slug);

  return (
    /*
     * 这里没有复用 <Container>：文章页是全站唯一的双栏布局（正文 + 目录侧栏），
     * 宽度约束要落在 grid 容器上，硬套 Container 就得用 !important 覆盖，反而更脆。
     * xl 以下的宽度与 padding 与 Container 的 prose 档保持一致。
     */
    <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-6 lg:px-8 xl:grid xl:max-w-[70rem] xl:grid-cols-[minmax(0,1fr)_15rem] xl:gap-12">
      <article className="min-w-0">
        {/* 移动端：折叠目录。xl 以上隐藏，因为侧栏已经显示了 */}
        {headings.length > 0 && (
          <details className="mb-8 xl:hidden">
            <summary className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
              目录
            </summary>
            <div className="mt-2">
              <Toc headings={headings} isMobile />
            </div>
          </details>
        )}

        {/* 顶部装饰渐变条 */}
        <div
          aria-hidden
          className="mb-8 h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
        />

        <header>
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
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

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-r from-zinc-900 via-blue-800 to-violet-800 bg-clip-text text-transparent dark:from-zinc-50 dark:via-blue-200 dark:to-violet-200">
              {post.title}
            </span>
          </h1>

          {post.description && (
            <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {post.description}
            </p>
          )}

          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <TagPill key={tag} tag={tag} size="md" />
              ))}
            </div>
          )}
        </header>

        {/* 正文区 */}
        <div className="prose prose-zinc mt-12 max-w-none dark:prose-invert">
          <Content />
        </div>

        {/* 底部：上一篇 / 下一篇 + 回到列表 */}
        <footer className="mt-16 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          {(prev || next) && (
            <nav
              aria-label="文章导航"
              className="mb-8 grid gap-4 sm:grid-cols-2"
            >
              {prev && <AdjacentLink post={prev} direction="prev" />}
              {/* next 固定放在第二列，这样 prev 缺失时它不会跳到左边 */}
              {next && (
                <div className="sm:col-start-2">
                  <AdjacentLink post={next} direction="next" />
                </div>
              )}
            </nav>
          )}

          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">
              ←
            </span>
            返回文章列表
          </Link>
        </footer>
      </article>

      {/* 桌面端：吸顶目录侧栏 */}
      {headings.length > 0 && (
        <aside className="hidden pt-14 xl:block">
          <div className="sticky top-24">
            <Toc headings={headings} />
          </div>
        </aside>
      )}
    </div>
  );
}

/** 上一篇 / 下一篇卡片。direction 决定箭头方向与文字对齐 */
function AdjacentLink({
  post,
  direction,
}: {
  post: { slug: string; title: string };
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex h-full flex-col gap-1.5 rounded-xl border border-zinc-200 p-4 transition-colors hover:border-blue-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-blue-800 dark:hover:bg-zinc-900/50 ${
        isPrev ? "items-start" : "items-end text-right"
      }`}
    >
      <span className="flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {isPrev && (
          <span className="inline-block transition-transform group-hover:-translate-x-1">
            ←
          </span>
        )}
        {isPrev ? "上一篇" : "下一篇"}
        {!isPrev && (
          <span className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        )}
      </span>
      <span className="font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
        {post.title}
      </span>
    </Link>
  );
}