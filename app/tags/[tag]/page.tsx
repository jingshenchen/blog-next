import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { tagStyle } from "@/lib/tag-color";
import { Container } from "@/components/container";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata(props: PageProps<"/tags/[tag]">) {
  const { tag } = await props.params;
  const decoded = decodeURIComponent(tag);

  return {
    title: `标签：${decoded}`,
    description: `与「${decoded}」相关的文章。`,
  };
}

export default async function TagPage(props: PageProps<"/tags/[tag]">) {
  const { tag } = await props.params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <Container className="py-16">
      <header>
        <Link
          href="/tags"
          className="group inline-flex items-center gap-1 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-1">
            ←
          </span>
          全部标签
        </Link>

        <h1 className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-4 py-1.5 text-2xl font-bold ring-1 ring-inset ${tagStyle(decoded)}`}
          >
            {decoded}
          </span>
          <span className="text-zinc-600 dark:text-zinc-400">
            {posts.length} 篇文章
          </span>
        </h1>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
