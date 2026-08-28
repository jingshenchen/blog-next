import type { NextConfig } from "next";
import createMDX from "@next/mdx";

/*
 * GitHub Pages 是项目站点，发布在 https://<user>.github.io/<repo>/ 子路径下，
 * 因此需要 basePath。本地开发不设这个变量，站点仍在根路径，避免每次都要敲子路径；
 * CI 里由 workflow 注入 /blog-next。
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // GitHub Pages 只能托管静态资源，构建产物输出到 out/
  output: "export",
  basePath,
  // next/image 的默认 loader 需要服务端，静态导出下必须关掉
  images: { unoptimized: true },
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
