/** 站点级配置。换成你自己的信息即可，其余代码都从这里取值。 */
export const siteConfig = {
  name: "cjs的碎碎念",
  title: "cjs的碎碎念 · 个人博客",
  description: "记录 Web 开发、工程实践与踩坑过程。",
  author: "jingshenchen",
  /** 生成 sitemap / RSS 的绝对地址，部署时用环境变量覆盖 */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  nav: [
    { href: "/", label: "首页" },
    { href: "/blog", label: "文章" },
    { href: "/tags", label: "标签" },
    { href: "/about", label: "关于" },
  ],
} as const;
