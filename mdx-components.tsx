import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

// MDX 元素 → 组件映射。排版整体交给 @tailwindcss/typography 的 prose，
// 这里只覆盖需要额外行为的元素。
const components = {
  a: ({ href = "", children, ...rest }) => {
    // 站内链接走 next/link 以获得预取和客户端跳转，外链一律新窗口打开
    if (href.startsWith("/") || href.startsWith("#")) {
      return (
        <Link href={href} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  },

  // Markdown 的 ![alt](src) 语法无法提供宽高，而 next/image 又要求显式尺寸。
  // width/height 传 0 配合 sizes 与 CSS，让浏览器按容器宽度自适应。
  // 需要精确控制尺寸时，在 MDX 里直接用 <Image> 组件即可。
  img: ({ src, alt = "", ...rest }) => {
    if (typeof src !== "string") {
      return null;
    }
    return (
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        className="h-auto w-full rounded-lg"
        {...rest}
      />
    );
  },
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
