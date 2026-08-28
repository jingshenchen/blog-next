"use client";

import { useEffect, useRef, useState } from "react";

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

/**
 * 文章目录（TOC）。
 *
 * - 桌面端侧栏：吸顶 + 滚动高亮当前章节（IntersectionObserver）
 * - 移动端：放在 `<details>` 里折叠，不启用 scroll-spy（因为 isMobile 时隐藏）
 *
 * 之所以需要客户端，唯一的原因是滚动高亮。纯列表展示不需要 JS。
 */
export function Toc({
  headings,
  isMobile,
}: {
  headings: readonly TocHeading[];
  isMobile?: boolean;
}) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0 || isMobile) return;

    // 先清空，再建新的，避免热更新时用旧 observer 监听不存在的元素
    observerRef.current?.disconnect();

    const elMap = new Map<string, Element>();
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) elMap.set(h.id, el);
    }
    if (elMap.size === 0) return;

    // 首次激活顶部的标题
    setActiveId(headings[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        // 进入视口的标题里，取最靠上的那个
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // 在标题进入视口顶部偏下的位置触发，比默认的 0 更早一点点
        rootMargin: "-80px 0px -60% 0px",
      },
    );

    for (const el of elMap.values()) observer.observe(el);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [headings, isMobile]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="文章目录">
      {!isMobile && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          目录
        </p>
      )}
      <ul className="space-y-1">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: h.level === 3 ? "1rem" : undefined }}
          >
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                  // 地址栏同步更新锚点但不触发滚动
                  history.pushState(null, "", `#${h.id}`);
                }
              }}
              className={`block rounded px-2 py-1 text-sm leading-relaxed transition-colors ${
                activeId === h.id
                  ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}