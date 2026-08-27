import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPublishedPostSlugs } from "@/lib/content";
import { TagPill } from "@/components/tag-pill";
import { Container } from "@/components/container";

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

  return (
    <Container as="article" width="prose" className="py-16">
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

      {/* 底部：回到列表 */}
      <footer className="mt-16 border-t border-zinc-200 pt-8 dark:border-zinc-800">
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
    </Container>
  );
}