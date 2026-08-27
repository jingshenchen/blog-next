import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/content";
import { PostCard, FeaturedPostCard } from "@/components/post-card";
import { TagPill } from "@/components/tag-pill";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/container";

const RECENT_COUNT = 5;

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const [featured, ...rest] = posts;
  const recent = rest.slice(0, RECENT_COUNT - 1);

  return (
    <div className="relative overflow-hidden">
      {/* 顶部装饰光斑，纯装饰不参与交互。宽度跟随视口，避免在窄屏溢出、在宽屏冲淡正文对比度 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[24rem] w-[120%] max-w-[64rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-200/30 via-violet-200/30 to-cyan-200/30 blur-3xl sm:h-[32rem] dark:from-blue-900/20 dark:via-violet-900/20 dark:to-cyan-900/20"
      />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <section>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-zinc-900 via-blue-800 to-violet-800 bg-clip-text text-transparent dark:from-zinc-50 dark:via-blue-200 dark:to-violet-200">
              {siteConfig.name}
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {siteConfig.description}
          </p>

          {/* 统计条 */}
          <dl className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <div className="flex items-baseline gap-2">
              <dd className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                {posts.length}
              </dd>
              <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                篇文章
              </dt>
            </div>
            <div className="flex items-baseline gap-2">
              <dd className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                {tags.length}
              </dd>
              <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                个标签
              </dt>
            </div>
            <Link
              href="/feed.xml"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <circle cx="6.18" cy="17.82" r="2.18" />
                <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
              </svg>
              RSS
            </Link>
          </dl>

          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.slice(0, 8).map(({ tag, count }) => (
                <TagPill key={tag} tag={tag} count={count} size="md" />
              ))}
            </div>
          )}
        </section>

        {posts.length === 0 ? (
          <p className="mt-16 rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            还没有文章。在 <code>content/posts/</code> 下新建一个 .mdx
            文件就会出现在这里。
          </p>
        ) : (
          <>
            <section className="mt-16">
              <FeaturedPostCard post={featured} />
            </section>

            {recent.length > 0 && (
              <section className="mt-14">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-sm font-semibold tracking-widest text-zinc-600 uppercase dark:text-zinc-400">
                    近期文章
                  </h2>
                  {posts.length > RECENT_COUNT && (
                    <Link
                      href="/blog"
                      className="group text-sm font-medium text-zinc-600 transition-colors hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                    >
                      全部 {posts.length} 篇
                      <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  )}
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {recent.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
