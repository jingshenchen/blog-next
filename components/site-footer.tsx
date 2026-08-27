import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/container";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-zinc-200/70 dark:border-zinc-800/70">
      <Container className="flex flex-col gap-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-xs font-bold text-white">
            {siteConfig.name.slice(0, 1)}
          </span>
          <p className="text-zinc-600 dark:text-zinc-400">
            © {new Date().getFullYear()} {siteConfig.author}
          </p>
        </div>

        <nav aria-label="页脚导航">
          <ul className="flex items-center gap-5 text-zinc-600 dark:text-zinc-400">
            {siteConfig.nav.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/feed.xml"
                className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                RSS
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
