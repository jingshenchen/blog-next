import type { Metadata } from "next";
import { getAllTags } from "@/lib/content";
import { TagPill } from "@/components/tag-pill";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "标签",
  description: "按标签浏览文章。",
};

export default function TagsIndexPage() {
  const tags = getAllTags();

  return (
    <Container className="py-16">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-50">
          标签
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          共 <span className="font-semibold tabular-nums">{tags.length}</span>{" "}
          个
        </p>
      </header>

      {tags.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          还没有标签。在文章的 frontmatter 里加 <code>tags: [标签名]</code> 即可。
        </p>
      ) : (
        <div className="mt-10 flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <TagPill key={tag} tag={tag} count={count} size="md" />
          ))}
        </div>
      )}
    </Container>
  );
}
