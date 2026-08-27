import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // 让 .md / .mdx 也能作为页面与可导入模块参与构建
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  // @next/mdx 默认只处理 .mdx，这里放开 .md
  extension: /\.(md|mdx)$/,
  options: {
    // Turbopack 下插件必须用字符串名 + 可序列化 options：
    // 函数无法传给 Rust 侧。见 docs/01-app/02-guides/mdx.md
    remarkPlugins: [
      "remark-frontmatter", // 剥离正文顶部的 YAML 块（元数据另由 gray-matter 解析）
      "remark-gfm", // 表格、删除线、任务列表
    ],
    rehypePlugins: [
      "rehype-slug", // 必须先于 autolink-headings，后者依赖 id
      [
        "rehype-pretty-code",
        {
          theme: { light: "github-light", dark: "github-dark-dimmed" },
          defaultLang: "text",
        },
      ],
      ["rehype-autolink-headings", { behavior: "wrap" }],
    ],
  },
});

export default withMDX(nextConfig);
