# cjs的碎碎念 —— 个人博客项目计划书

| 项目 | 信息 |
|---|---|
| 项目名称 | cjs的碎碎念 · 个人博客 |
| 仓库 | https://github.com/jingshenchen/blog-next |
| 目标地址 | https://jingshenchen.github.io/blog-next/ |
| 作者 | jingshenchen |
| 文档版本 | v1.0 |
| 编写日期 | 2026-08-27 |

> 说明：本文档中「已完成」一节的所有结论均来自对当前代码与构建产物的实际检查；
> 「规划」各节是提案，尚未实现。凡未经验证的判断均已显式标注。

---

## 一、项目概述与目标

### 1.1 项目定位

一个**纯静态**的个人技术博客。文章以 MDX 文件形式提交到 Git 仓库，在构建期全量预渲染为静态 HTML，托管于 GitHub Pages。浏览器端不请求任何后端接口。

### 1.2 核心目标

| 编号 | 目标 | 度量方式 |
|---|---|---|
| G1 | 写作成本低 —— 新增一篇文章只需增加一个 `.mdx` 文件，无需改动任何代码 | 从建文件到上线的操作步数 ≤ 3（建文件 → 提交 → 推送） |
| G2 | 零运维成本 —— 不维护服务器、数据库、后端服务 | 月度成本 0 元，无需登录任何服务器 |
| G3 | 首屏快 —— 浏览器不加载语法高亮库等重型运行时 | 高亮在构建期完成，客户端 JS 中不含 Shiki |
| G4 | 内容层可复用 —— 将来接入微信小程序时无需重写读取逻辑 | 内容读取逻辑集中于单一模块，且不含 JSX |
| G5 | 全端可读 —— 手机到宽屏桌面都有合理版式，文字对比度达 WCAG AA | 断点覆盖 sm~2xl；正文对比度 ≥ 4.5:1 |

### 1.3 非目标（明确不做）

明确划出边界，避免范围蔓延：

- **不做后台管理界面。** 写作入口是编辑器 + Git，不是网页表单。
- **不做用户注册与登录。** 无用户体系。
- **不做服务端渲染与动态接口。** 静态导出模式下技术上也不支持（见 5.3）。
- **不做多语言。** 仅中文（`lang="zh-CN"`）。

---

## 二、技术选型与理由

### 2.1 技术栈

| 层次 | 选型 | 版本 |
|---|---|---|
| 框架 | Next.js App Router（Turbopack） | 16.3.3 |
| UI | React | 19.2.8 |
| 语言 | TypeScript | ^5 |
| 样式 | Tailwind CSS（CSS-first 配置） | ^4 |
| 排版插件 | @tailwindcss/typography | ^0.5.20 |
| 内容格式 | MDX（@next/mdx） | ^16.3.3 |
| Frontmatter 解析 | gray-matter | ^4.0.3 |
| 语法高亮 | Shiki（经 rehype-pretty-code） | ^4.4.3 |
| Markdown 增强 | remark-gfm / remark-frontmatter | ^4.0.1 / ^5.0.0 |
| 标题锚点 | rehype-slug + rehype-autolink-headings | ^6.0.0 / ^7.1.0 |
| 托管 | GitHub Pages（GitHub Actions 部署） | — |

运行时要求：Node.js ≥ 20.9.0（Next 16 的 `engines` 约束）。

### 2.2 关键决策及理由

**为什么用静态导出而不是 SSR？**
博客内容在构建期就已完全确定，没有任何需要按请求变化的部分。静态导出换来零运维、免费托管和最快的首屏。代价是失去动态接口能力（详见 5.3 的应对方案）。

**为什么文章用 MDX 文件而不是数据库 / CMS？**
契合 G1 和 G2。文章跟代码同仓库，天然拥有版本历史、diff、回滚能力；不引入数据库就没有备份和迁移负担。代价是非技术人员无法撰写 —— 但本项目只有一位作者，不构成问题。

**为什么语法高亮放在构建期？**
Shiki 体积较大，若放在客户端会显著拖慢首屏（G3）。构建期完成后，产物里只有带 inline style 的 HTML。为支持深色模式，配置了双主题（`github-light` / `github-dark-dimmed`），Shiki 输出 `--shiki-light` / `--shiki-dark` 两套 CSS 变量，由 `globals.css` 按 `.dark` 类切换。

**为什么内容层要刻意不含 JSX？**
这是 G4 的核心手段。`lib/content.ts` 只返回纯数据（`PostMeta` 对象），不返回 React 元素，也不被页面之外的地方直接调用 `fs`。将来接小程序时，只需在这些函数之上加一层序列化输出，页面代码一行都不用改。

**为什么深色模式用内联同步脚本？**
若在 `useEffect` 里切换主题，首帧必然已按浅色绘制完成，会闪一下白屏。因此在 `<head>` 内放一段同步 `<script>`，在首次绘制前就把 `.dark` 类加到 `<html>` 上。配套决策：`ThemeToggle` 组件**不持有 React state**，唯一状态来源是 DOM 上的 `.dark` 类，以此避免 hydration 不匹配。

---

## 三、已完成的工作（现状）

以下均经过实际构建与产物检查验证。

### 3.1 功能清单

| 模块 | 路由 | 渲染方式 | 状态 |
|---|---|---|---|
| 首页（主推 + 近期文章 + 标签云 + 统计） | `/` | 静态 | ✅ |
| 文章列表 | `/blog` | 静态 | ✅ |
| 文章详情 | `/blog/[slug]` | SSG | ✅ |
| 标签索引 | `/tags` | 静态 | ✅ |
| 标签详情 | `/tags/[tag]` | SSG | ✅ |
| 关于 | `/about` | 静态 | ✅ |
| RSS 订阅 | `/feed.xml` | 静态文件 | ✅ |
| 站点地图 | `/sitemap.xml` | 静态文件 | ✅ |
| 爬虫规则 | `/robots.txt` | 静态文件 | ✅ |
| 404 页 | `/404.html` | 静态 | ✅ |
| 错误边界 | `app/blog/error.tsx` | 客户端 | ✅ |
| 深色模式（手动切换 + 跟随系统，无闪白） | — | — | ✅ |
| 响应式布局（sm~2xl 全断点） | — | — | ✅ |

当前构建规模：**19 个静态页面**，源码约 1221 行（`app` + `components` + `lib`），3 篇文章，6 个标签。

### 3.2 目录结构

```
my-app/
├─ app/
│  ├─ layout.tsx              根布局：字体、metadata、深色模式初始化脚本
│  ├─ page.tsx                首页
│  ├─ globals.css             Tailwind 入口 + 代码块/排版自定义样式
│  ├─ blog/
│  │  ├─ page.tsx             文章列表
│  │  ├─ [slug]/page.tsx      文章详情（generateStaticParams 预渲染）
│  │  ├─ error.tsx            错误边界
│  │  └─ not-found.tsx        文章未找到
│  ├─ tags/
│  │  ├─ page.tsx             标签索引
│  │  └─ [tag]/page.tsx       标签详情
│  ├─ about/page.tsx
│  ├─ feed.xml/route.ts       RSS（force-static）
│  ├─ sitemap.ts              站点地图（force-static）
│  └─ robots.ts               爬虫规则（force-static）
├─ components/
│  ├─ container.tsx           全站统一响应式容器
│  ├─ site-header.tsx         吸顶导航
│  ├─ site-footer.tsx
│  ├─ post-card.tsx           PostCard / FeaturedPostCard
│  ├─ tag-pill.tsx            标签胶囊
│  └─ theme-toggle.tsx        主题切换（无 state）
├─ lib/
│  ├─ content.ts              ★ 内容层，全站唯一读取文章的入口
│  ├─ site.ts                 ★ 站点配置单一数据源
│  └─ tag-color.ts            标签配色（哈希取模，全字面量类名）
├─ content/posts/*.mdx        文章
├─ mdx-components.tsx         MDX 元素映射
├─ next.config.ts             静态导出 + basePath + MDX 插件链
└─ .github/workflows/deploy.yml
```

两个标注 ★ 的文件是架构关键点：**所有站点信息从 `lib/site.ts` 流出，所有文章数据从 `lib/content.ts` 流出。** 修改站名、导航、描述只需动前者。

### 3.3 内容层 API

`lib/content.ts` 对外暴露：

| 函数 | 用途 |
|---|---|
| `getAllPosts()` | 已发布文章，按日期倒序 |
| `getAllPostSlugs()` | 磁盘上全部 slug（不过滤草稿） |
| `getPublishedPostSlugs()` | 供 `generateStaticParams` 用 |
| `getPostBySlug(slug)` | 单篇元数据，草稿在生产环境返回 `null` |
| `getAllTags()` | 标签及计数，按热度倒序 |
| `getPostsByTag(tag)` | 按标签筛选（大小写不敏感） |

配套设计：

- **草稿隔离** —— `draft: true` 的文章仅在 `NODE_ENV === "development"` 可见，构建产物里不出现。
- **快速失败** —— frontmatter 缺 `title` 或 `date` 格式非法时**直接抛错中断构建**，而非静默产出坏页面。
- **中英文分别计速的阅读时长** —— 中文 350 字/分、英文 220 词/分。若不分开计算，中文会被空白切词当成一个巨型单词，估算严重失真。

### 3.4 响应式布局

已修复的问题：改造前全站硬编码 `max-w-4xl`，编译产物中**只有 `sm` 一个断点**，导致 640px 以上宽度页面完全不再变化 —— 实质上只适配了手机。

现方案由 `components/container.tsx` 统一承担：

| 断点 | 内容宽度 | 列表列数 |
|---|---|---|
| < 768px | `max-w-3xl` | 1 |
| md 768 | `max-w-4xl` | 2 |
| lg 1024 | `max-w-5xl` | 3 |
| xl 1280 | `max-w-6xl` | 3 |
| 2xl 1536 | 88rem (1408px) | 4 |

水平内边距 `px-5 → sm:px-6 → lg:px-8 → 2xl:px-12`。正文页（文章详情、关于）单独使用 `width="prose"`，仅放开到 `xl:max-w-4xl` —— 正文行宽过长会伤害可读性。

已验证产物中 5 个断点（40/48/64/80/96rem）全部存在。

### 3.5 可访问性修复

已修正的对比度问题：

| 位置 | 修改前 | 对比度 | 修改后 |
|---|---|---|---|
| 首页「近期文章」小标题 | `text-zinc-400 dark:text-zinc-600` | ≈2.6:1 ❌ | `text-zinc-500 dark:text-zinc-400` |
| 卡片元信息 / 页脚 / 日期 | `dark:text-zinc-500` | ≈4.1:1 ❌ | `dark:text-zinc-400` |
| 浅色下次要文字 | `text-zinc-500` | ≈4.8:1 △ | `text-zinc-600` |

同时缩小了首页顶部装饰光斑（`32rem`→`24rem`，不透明度 40%→30%，宽度改为 `w-[120%] max-w-[64rem]` 以免窄屏溢出），此前它会冲淡标题区背景，进一步降低有效对比度。

### 3.6 构建与部署配置

`next.config.ts` 要点：

- `output: "export"` —— 产物输出到 `out/`
- `basePath` 由 `NEXT_PUBLIC_BASE_PATH` 注入。本地开发不设该变量，站点在根路径；CI 注入 `/blog-next`。**刻意不硬编码**，以免本地开发每次都要敲子路径。
- `images.unoptimized: true` —— `next/image` 默认 loader 需要服务端
- MDX 插件链使用**字符串插件名 + 可序列化 options** —— Turbopack 下插件配置要跨语言边界传给 Rust 侧，函数无法序列化

`.github/workflows/deploy.yml`：push 到 `master` 时触发，`actions/configure-pages` 输出 `base_path` 与 `base_url` 注入构建，产物经 `upload-pages-artifact` → `deploy-pages` 发布。保留了 `workflow_dispatch` 以支持手动触发。

**踩过的坑（已解决）：** `sitemap.ts` 与 `robots.ts` 会被编译成 route handler，在 `output: "export"` 下必须显式声明 `export const dynamic = "force-static"`，否则构建直接失败。

### 3.7 当前阻塞项

⚠️ **部署尚未确认上线。** 代码与流水线配置均已推送到远程，但以下两步需在 GitHub 网页端手动完成，目前状态未知：

1. Settings → Pages → Source 改为 **GitHub Actions**（默认是 "Deploy from a branch"，不改则流水线跑完也不会发布）
2. Settings → General → 确认 Default branch 为 `master`（workflow 监听 `master`；若实际为 `main` 需同步调整）

---

## 四、分阶段开发计划

### 阶段一：内容与体验完善

目标：把「能用」做到「好用」，先解决已知的体验缺口。

| 编号 | 任务 | 说明 | 优先级 |
|---|---|---|---|
| T1.1 | 完成 GitHub Pages 上线确认 | 见 3.7 两步，并验证线上样式与资源加载正常 | 🔴 高 |
| T1.2 | 验证浏览器兼容性 | 见 5.1，需确认实际使用的浏览器版本后再决定是否加降级 | 🔴 高 |
| T1.3 | 移动端导航 | 当前 header 平铺 4 个导航项 + 主题切换，窄屏可能挤压；改为汉堡菜单或横向滚动 | 🔴 高 |
| T1.4 | 文章列表分页 | 当前 `/blog` 一次渲染全部文章，文章数上百后页面体积和首屏都会恶化 | 🟡 中 |
| T1.5 | 文章内目录（TOC） | 锚点 id 已由 rehype-slug 生成，具备实现基础；桌面端侧栏吸顶显示 | 🟡 中 |
| T1.6 | 上一篇 / 下一篇导航 | 基于 `getAllPosts()` 的顺序即可实现，无需新数据 | 🟡 中 |
| T1.7 | 代码块复制按钮 | 需客户端组件；注意不要因此把高亮逻辑带回客户端 | 🟡 中 |
| T1.8 | Open Graph 图片 | 当前 metadata 无 `og:image`，分享到社交平台无预览图 | 🟡 中 |
| T1.9 | 站点标记视觉调整 | logo 方块取站名首字，现为小写 `c`，在圆角方块中偏小偏空 | 🟢 低 |

### 阶段二：搜索、评论与统计

目标：在不引入后端的前提下补齐互动与可观测能力。这是纯静态站的主要挑战。

| 编号 | 任务 | 技术路径 | 优先级 |
|---|---|---|---|
| T2.1 | 站内搜索 | 构建期生成搜索索引 JSON，客户端加载后本地检索。候选方案：Pagefind（自动分片，适合内容增长）或 Fuse.js（实现简单，索引需全量加载）。**中文分词是关键考量点，选型前需实测。** | 🔴 高 |
| T2.2 | 评论系统 | 推荐 giscus —— 基于 GitHub Discussions，无后端、无数据库，与「内容在 Git 里」的整体思路一致。代价：读者需有 GitHub 账号。 | 🟡 中 |
| T2.3 | 访问统计 | 静态站无服务端日志，需第三方。候选：Umami（可自托管）、Plausible、Vercel Analytics。需权衡隐私与是否愿意引入外部脚本。 | 🟡 中 |
| T2.4 | 文章归档页 | 按年月分组的时间轴视图 | 🟢 低 |
| T2.5 | 相关文章推荐 | 基于标签重合度计算，构建期完成 | 🟢 低 |

### 阶段三：多端复用（微信小程序）

目标：兑现 G4 的架构预留。**前提是届时确实需要小程序端** —— 若需求未出现，本阶段不应启动。

| 编号 | 任务 | 说明 |
|---|---|---|
| T3.1 | 输出静态 JSON 数据文件 | 在 `lib/content.ts` 之上加一层，构建期生成 `/api/posts.json`、`/api/posts/[slug].json` 等静态文件。**注意：静态导出下无法提供动态接口**，只能是构建期定稿的静态 JSON（详见 5.3） |
| T3.2 | 正文内容的跨端表示 | 当前正文是编译后的 MDX 组件，小程序无法直接消费。需决策：输出 HTML 字符串（小程序用 rich-text 渲染）还是输出结构化 AST（渲染更可控但工作量大） |
| T3.3 | 小程序端实现 | 消费上述 JSON |

**T3.2 是本阶段的真正难点**，也是当前架构尚未解决的部分。现有的「内容层不含 JSX」只解决了**元数据**的复用，正文渲染的跨端方案仍需设计。这一点在初始设计中被低估了，此处如实记录。

---

## 五、风险与应对

### 5.1 浏览器兼容性（未验证，风险等级：中）

**风险描述：** Tailwind CSS v4 的编译产物中包含 117 处 `color-mix()` 和 61 处 `@property`，**均无降级写法**。

- `color-mix()` 驱动全部不透明度修饰符 —— 吸顶导航的 `bg-white/70`、卡片背景 `dark:bg-zinc-900/50`、所有边框的 `/70`、8 套标签配色
- `@property` 驱动渐变插值 —— 标题的 `bg-clip-text` 渐变文字

基线要求为 Chrome 111+ / Safari 16.4+。若低于此版本，吸顶导航会变成完全透明（内容滚动时穿透，即典型的「样式错乱」），渐变标题可能不可见。

**已排除的部分：** 产物中 `oklch()` 出现 0 次，颜色变量均为「十六进制 + `lab()`」双声明形式，旧浏览器会优雅降级到十六进制。所以**颜色本身不是问题**。

**待确认：** 开发机为 Windows 10 Pro build 18363（1909），该 OS 版本较旧，存在浏览器版本偏低的可能。**但实际浏览器版本至今未确认，此风险尚未证实，也未排除。**

**应对：**
1. 首先确认实际浏览器版本（`chrome://version`）
2. 若确认版本过低，为关键位置补 `@supports` 降级 —— 优先级：吸顶导航背景 > 卡片背景 > 渐变标题
3. 若版本达标，则本项仅作为已知约束记录，不做额外处理

### 5.2 其他风险

| 风险 | 影响 | 应对 |
|---|---|---|
| `basePath` 与仓库名强耦合 | 重命名仓库或接入自定义域名后，资源路径全部失效 | 已通过环境变量注入而非硬编码，切换时只需改 workflow 一处；变更后须验证 `sitemap.xml` 中的绝对地址 |
| GitHub Pages 国内访问速度 | 访问慢或间歇不可达 | 可选：接入 CDN、或改用国内静态托管。因产物是纯静态文件，迁移成本很低 |
| 中文 URL | 标签路由为 `/tags/架构` 形式，产物为 UTF-8 文件名目录 | 产物结构已验证正常生成；**线上实际访问尚未验证**，属 T1.1 的验收内容 |
| 无自动化测试 | 重构时缺少回归保护 | 当前规模下由 `next build` 的类型检查 + 快速失败机制兜底；文章数或组件数显著增长后，应为 `lib/content.ts` 补单元测试（frontmatter 校验、阅读时长、标签聚合是重点） |
| 全局 `http.sslVerify = false` | 所有仓库的 HTTPS 操作不校验证书，存在中间人风险 | 建议 `git config --global --unset http.sslVerify`；若因此报证书错误，应导入 CA 根证书而非关闭校验 |
| GitHub 网络不稳定 | push 间歇性超时 | 重试即可，**不要使用 `git push -f`** |

### 5.3 架构约束：静态导出没有动态接口

这不是缺陷而是选型的必然代价，但需明确记录以免后续误判：

`output: "export"` 模式下，以下能力**不可用**：Server Actions、动态 Route Handler（依赖 Request 的）、Cookies、middleware/proxy、rewrites/redirects/headers、ISR、`next/image` 默认 loader、Draft Mode、拦截路由。Route Handler 仅支持 `GET` 且必须标记 `force-static`。

因此任何"需要服务端"的功能（表单提交、点赞计数、动态搜索接口）都必须走以下三条路之一：

1. 构建期定稿为静态文件（搜索索引走这条）
2. 交给第三方服务（评论走 giscus、统计走 Umami）
3. 放弃静态导出，改为 Vercel 等支持服务端的托管（**会牺牲 G2 零运维目标，需慎重**）

---

## 六、验收标准

### 6.1 阶段一验收

- [ ] 线上地址可正常访问，首页、列表、详情、标签、关于五类页面均无 404
- [ ] 线上无资源加载失败（DevTools Network 无 404，尤其 `_next/` 下的 CSS/JS/字体）
- [ ] 中文标签页（如 `/tags/架构`）线上可正常访问
- [ ] RSS、sitemap、robots 三个文件线上可访问，且其中的绝对地址指向正确域名
- [ ] 在 375 / 768 / 1024 / 1440 / 1920 五种宽度下，无横向滚动条、无内容溢出、无元素重叠
- [ ] 深色模式刷新页面无白屏闪烁；手动切换后刷新，选择被保留
- [ ] 正文与次要文字对比度均 ≥ 4.5:1
- [ ] 已确认浏览器兼容性风险（5.1）为「已排除」或「已加降级」

### 6.2 阶段二验收

- [ ] 搜索能命中中文标题与正文，响应无可感延迟
- [ ] 评论可正常发布与显示，且不阻塞首屏渲染
- [ ] 统计数据可查看，且引入的第三方脚本不显著拖慢首屏

### 6.3 长期质量基线

以下为每次改动均需维持的底线：

- [ ] `next build` 无错误、无类型错误
- [ ] 新增文章无需改动任何代码即可上线（G1）
- [ ] 页面组件不直接使用 `fs` 或 `gray-matter`，一律经由 `lib/content.ts`（G4）
- [ ] 站点级信息只在 `lib/site.ts` 中定义，不散落到各页面
- [ ] Tailwind 类名保持字面量，不使用 `bg-${color}-50` 式插值（否则静态扫描失效，样式丢失）
- [ ] 客户端 JS 不包含 Shiki 等构建期依赖（G3）

---

## 附录 A：新增一篇文章的流程

```bash
# 1. 新建文件
content/posts/your-slug.mdx
```

```mdx
---
title: 文章标题
description: 一句话摘要，用于列表页和 SEO
date: 2026-08-27
tags: [标签一, 标签二]
draft: false        # 可选；true 则仅本地可见，不进构建产物
---

正文从这里开始，支持 GFM 表格、任务列表、删除线，以及带语法高亮的代码块。
```

```bash
# 2. 本地预览
npm run dev          # http://localhost:3000

# 3. 提交推送，CI 自动部署
git add -A && git commit -m "post: 文章标题" && git push
```

`slug` 即文件名（不含扩展名），会成为 URL 的一部分，建议用英文小写加连字符。

## 附录 B：常用命令

| 命令 | 用途 |
|---|---|
| `npm run dev` | 开发服务器，草稿可见，根路径无 basePath |
| `npm run build` | 静态导出到 `out/` |
| `npm start` | 本地预览 `out/` 静态产物（非 `next start`，导出模式下不适用） |
| `npm run lint` | ESLint 检查 |

本地模拟线上 basePath 构建（Git Bash 需禁用 MSYS 路径转换，否则 `/blog-next` 会被转成 Windows 路径）：

```bash
MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL='*' \
  NEXT_PUBLIC_BASE_PATH='/blog-next' \
  NEXT_PUBLIC_SITE_URL='https://jingshenchen.github.io/blog-next' \
  npx next build
```
