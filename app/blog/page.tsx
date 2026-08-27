import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "文章",
  description: "全部文章列表。",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <Container className="py-16">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-50">
          文章
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          共 <span className="font-semibold tabular-nums">{posts.length}</span>{" "}
          篇
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          还没有文章。在 <code>content/posts/</code> 下新建一个 .mdx 文件即可。
        </p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </Container>
  );
}
