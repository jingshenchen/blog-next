type Width = "wide" | "prose";

/**
 * 全站统一的响应式容器。
 *
 * 之前每个页面各写一份 `max-w-4xl px-6`，在 1440px+ 的桌面上内容只占不到一半宽度，
 * 且完全没有 lg/xl/2xl 断点。这里把宽度按断点逐级放开，padding 也随屏幕变宽，
 * 保证头部、页脚、内容区三者左右边界始终对齐。
 */
const WIDTHS: Record<Width, string> = {
  // 列表/首页：大屏放开到 88rem，配合多列网格
  wide: "max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[88rem]",
  // 正文页：宽度过大会伤害可读性，只小幅放开
  prose: "max-w-3xl xl:max-w-4xl",
};

export function Container({
  as: Tag = "div",
  width = "wide",
  className = "",
  children,
}: {
  /** 需要语义标签时传入，例如文章正文页用 "article" */
  as?: "div" | "article" | "section";
  width?: Width;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={`mx-auto w-full px-5 sm:px-6 lg:px-8 2xl:px-12 ${WIDTHS[width]} ${className}`}
    >
      {children}
    </Tag>
  );
}
