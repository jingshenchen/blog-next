import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/70 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-950/70">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          {/* 站点标记 */}
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            {siteConfig.name.slice(0, 1)}
          </span>
          <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <nav aria-label="主导航">
            <ul className="flex items-center gap-0.5">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mx-1 h-5 w-px bg-zinc-200 dark:bg-zinc-800" />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
