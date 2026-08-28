import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

/**
 * 内容层：全站唯一读取文章的入口。
 *
 * 这里刻意不含任何 React / JSX —— 返回的都是纯数据，所以将来接微信小程序时，
 * 只需在此之上加 route handler 把这些函数的结果序列化成 JSON，页面代码无需改动。
 * 页面组件不应直接使用 fs 或 gray-matter。
 */

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  /** ISO 日期字符串 yyyy-mm-dd */
  date: string;
  tags: string[];
  draft: boolean;
  /** 预估阅读分钟数，中英文分别计速 */
  readingMinutes: number;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const POST_EXTENSIONS = [".mdx", ".md"];

/** 草稿只在开发环境可见，构建产物里不出现 */
const includeDrafts = process.env.NODE_ENV === "development";

function estimateReadingMinutes(content: string): number {
  const cjkChars = (content.match(/[一-鿿]/g) ?? []).length;
  // 去掉 CJK 后按空白切词，避免中文被当成一个巨型单词
  const words = content
    .replace(/[一-鿿]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  // 中文约 350 字/分，英文约 220 词/分
  return Math.max(1, Math.round(cjkChars / 350 + words / 220));
}

function normalizeDate(value: unknown, slug: string): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }
  throw new Error(
    `文章 "${slug}" 的 frontmatter 缺少合法的 date 字段（需为 yyyy-mm-dd）`,
  );
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

function readPostFile(slug: string): { meta: PostMeta; content: string } {
  const filePath = POST_EXTENSIONS.map((ext) =>
    path.join(POSTS_DIR, `${slug}${ext}`),
  ).find((candidate) => fs.existsSync(candidate));

  if (!filePath) {
    throw new Error(`找不到文章文件：${slug}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  if (!data.title) {
    throw new Error(`文章 "${slug}" 的 frontmatter 缺少 title 字段`);
  }

  return {
    meta: {
      slug,
      title: String(data.title),
      description: String(data.description ?? ""),
      date: normalizeDate(data.date, slug),
      tags: normalizeTags(data.tags),
      draft: data.draft === true,
      readingMinutes: estimateReadingMinutes(content),
    },
    content,
  };
}

/** 磁盘上全部文章的 slug（不过滤草稿） */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => POST_EXTENSIONS.includes(path.extname(file)))
    .map((file) => file.replace(/\.mdx?$/, ""));
}

/** 已发布文章，按日期倒序 */
export function getAllPosts(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => readPostFile(slug).meta)
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** 供 generateStaticParams 使用：需要被预渲染的 slug 列表 */
export function getPublishedPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function getPostBySlug(slug: string): PostMeta | null {
  if (!getAllPostSlugs().includes(slug)) {
    return null;
  }
  const { meta } = readPostFile(slug);
  if (!includeDrafts && meta.draft) {
    return null;
  }
  return meta;
}

export type Heading = {
  /** 与正文 <h2>/<h3> 的 id 一致，可直接作为锚点 */
  id: string;
  text: string;
  /** 2 或 3，用于目录缩进 */
  level: 2 | 3;
};

/** 去掉行内 Markdown 标记，逼近 rehype-slug 看到的纯文本 */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]*)`/g, "$1") // 行内代码
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // 链接与图片，保留文字
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // 加粗
    .replace(/(\*|_)(.*?)\1/g, "$2") // 斜体
    .replace(/~~(.*?)~~/g, "$1") // 删除线
    .replace(/\s*\{#[^}]*\}\s*$/, "") // 显式 id 语法
    .trim();
}

/**
 * 提取文章的二三级标题，用于生成目录。
 *
 * 锚点 id 必须与正文里 rehype-slug 生成的完全一致，否则点击跳不过去 ——
 * 所以这里直接复用 rehype-slug 内部用的 github-slugger，而不是自己拼规则。
 * slugger 实例每篇文章新建一份，重名标题的 -1 / -2 后缀才能对上。
 *
 * 只取 h2/h3：h1 是文章标题（由页面渲染，不在正文里），h4 以下放进目录会太碎。
 */
export function getPostHeadings(slug: string): Heading[] {
  const { content } = readPostFile(slug);

  // 先剔除围栏代码块，否则 shell 注释里的 "# foo" 会被当成标题
  const withoutCodeFences = content.replace(/^```[\s\S]*?^```/gm, "");

  const slugger = new GithubSlugger();
  const headings: Heading[] = [];

  for (const line of withoutCodeFences.split("\n")) {
    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!match) continue;

    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;

    headings.push({
      id: slugger.slug(text),
      text,
      level: match[1].length as 2 | 3,
    });
  }

  return headings;
}

export type AdjacentPosts = {
  /** 时间上更早的一篇 */
  prev: PostMeta | null;
  /** 时间上更新的一篇 */
  next: PostMeta | null;
};

/**
 * 取某篇文章的相邻文章。
 *
 * getAllPosts() 是按日期倒序的（新的在前），所以「更早的一篇」在 index + 1，
 * 「更新的一篇」在 index - 1。这里只用已有排序，不引入新的数据来源。
 * 若 slug 不在已发布列表中（例如生产环境下的草稿），两侧都返回 null。
 */
export function getAdjacentPosts(slug: string): AdjacentPosts {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}

export type TagCount = { tag: string; count: number };

/** 全部标签，按文章数倒序、同数按名称排序 */
export function getAllTags(): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): PostMeta[] {
  const target = tag.toLowerCase();
  return getAllPosts().filter((post) =>
    post.tags.some((candidate) => candidate.toLowerCase() === target),
  );
}
