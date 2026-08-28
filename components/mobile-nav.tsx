"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { readonly href: string; readonly label: string };

/**
 * 窄屏导航。
 *
 * 桌面端由 SiteHeader 自己平铺渲染导航项，本组件在 md 以上直接隐藏，
 * 所以这里只需关心「汉堡按钮 + 展开面板」这一种形态。
 *
 * 之所以要拆成客户端组件：展开/收起是纯交互状态。header 其余部分保持
 * Server Component，避免把整个头部推到客户端。
 */
export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 路由变化后自动收起。点导航项跳转时，面板不会残留在新页面上。
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Esc 关闭。仅在展开时挂监听，收起后不留全局副作用。
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "关闭菜单" : "打开菜单"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="rounded-md p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      >
        {open ? (
          <CloseIcon className="h-5 w-5" />
        ) : (
          <MenuIcon className="h-5 w-5" />
        )}
      </button>

      {open && (
        <>
          {/* 点击空白处收起。放在面板之前，靠 z 层级压在面板下面 */}
          <div
            className="fixed inset-x-0 top-16 bottom-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          {/* 从 header 下沿铺开，避免和吸顶的 header 叠在一起 */}
          <nav
            id="mobile-nav-panel"
            aria-label="移动端导航"
            className="fixed inset-x-0 top-16 z-50 border-b border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
          >
            <ul className="px-5 py-2 sm:px-6">
              {items.map((item) => {
                // 首页要精确匹配，否则任何路径都会以 "/" 开头而全部高亮
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                        active
                          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
