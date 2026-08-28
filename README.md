# cjs的碎碎念 · 个人博客

基于 Next.js 16 App Router 构建的个人技术博客。文章以 MDX 文件形式管理，构建期全量预渲染为静态页。

## 特性

- **MDX 文章** — 本地 `.mdx` 文件，Git 管理版本，支持 React 组件内嵌
- **全静态生成** — 所有页面在构建期预渲染为静态 HTML，首屏直出，零运行时开销
- **代码高亮** — 由 `rehype-pretty-code` + Shiki 在构建期完成，浏览器不加载高亮库
- **深色模式** — 跟随系统或手动切换，内联脚本防止闪白
- **标签体系** — 按标签聚合文章，自动生成标签路由
- **SEO** — 自动生成 `sitemap.xml`、`robots.txt`、RSS 订阅
- **多端预备** — 内容层与渲染层分离，为将来接入微信小程序等客户端预留

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16.3.3 (App Router, Turbopack) |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS v4 (`@tailwindcss/typography`) |
| 内容 | MDX (`@next/mdx` + `remark`/`rehype` 插件) |
| 代码高亮 | `rehype-pretty-code` + `shiki` (双主题) |
| 字体 | Geist (Google Fonts) |

## 项目结构

```
├── app/
│   ├── layout.tsx           # 根布局（header / footer / 深色模式脚本）
│   ├── page.tsx             # 首页（最新文章 + 热门标签）
│   ├── globals.css          # 全局样式 + Tailwind 配置
│   ├── about/               # 关于页
│   ├── blog/
│   │   ├── page.tsx         # 文章列表
│   │   ├── [slug]/page.tsx  # 文章详情（动态路由 + 预渲染）
│   │   ├── error.tsx        # 博客区错误边界
│   │   └── not-found.tsx    # 博客区 404
│   ├── tags/
│   │   ├── page.tsx         # 标签索引
│   │   └── [tag]/page.tsx   # 标签聚合
│   ├── feed.xml/route.ts    # RSS 订阅
│   ├── sitemap.ts           # 站点地图
│   └── robots.ts            # 爬虫规则
├── components/
│   ├── site-header.tsx
│   ├── site-footer.tsx
│   ├── post-card.tsx
│   └── theme-toggle.tsx     # 深色模式开关（无状态、无闪烁）
├── content/
│   └── posts/               # 文章源文件（.mdx），文件名即 URL slug
├── lib/
│   ├── content.ts           # 内容层：全站唯一读文章的入口
│   └── site.ts              # 站点配置（站名、描述、URL）
├── mdx-components.tsx       # MDX 全局组件映射（链接、图片）
└── next.config.ts           # MDX 插件配置
```

## 架构：内容层与渲染层分离

这是为多端（如微信小程序）预留的关键决策：

```
content/posts/*.mdx
        ↓
lib/content.ts          ← 唯一内容入口，返回纯数据，不含任何 JSX
        ↓
app/**/page.tsx         ← 页面只调用 lib/content，不直接碰 fs
```

- `lib/content.ts` 中的函数（`getAllPosts()`、`getPostBySlug()` 等）只返回纯 JSON 数据，不含 React 组件
- 将来接小程序只需在 `lib/content.ts` 之上加 route handler，页面代码无需改动

## 写新文章

在 `content/posts/` 下新建 `.mdx` 文件，文件名即 URL slug。

```yaml
---
title: 文章标题
description: 一句话摘要
date: 2026-08-27
tags: [标签一, 标签二]
draft: false   # true 则只在开发环境可见，不进入构建产物
---
```

正文中支持 markdown 与 MDX 语法，可内嵌 React 组件，代码块自动高亮。

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:3000）
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 部署

本项目构建产物为全静态页 + 可选 API 路由，可部署到：

**Vercel**（推荐）
推 Git 仓库即可，自动识别 Next.js 项目。零配置。

**自托管 Node 服务器**
```bash
npm run build
npm start
```

> 不使用 `output: 'export'` 是因为纯静态导出无法运行服务端 API，未来小程序接口需要 route handler。

## 配置

编辑 `lib/site.ts` 修改站点信息：

```ts
export const siteConfig = {
  name: "你的站名",
  title: "你的站名 · 个人博客",
  description: "站点描述。",
  author: "作者名",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
```

部署时务必设置环境变量 `NEXT_PUBLIC_SITE_URL`，否则 RSS 和 sitemap 中的链接不正确。

## 许可证

MIT