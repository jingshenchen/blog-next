import Link from "next/link";
import { tagStyle } from "@/lib/tag-color";

type Size = "sm" | "md";

const SIZES: Record<Size, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export function TagPill({
  tag,
  count,
  size = "sm",
}: {
  tag: string;
  count?: number;
  size?: Size;
}) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      className={`inline-flex items-baseline gap-1.5 rounded-full font-medium ring-1 ring-inset transition-all duration-200 hover:scale-105 ${SIZES[size]} ${tagStyle(tag)}`}
    >
      {tag}
      {count !== undefined && (
        <span className="text-[0.85em] opacity-60">{count}</span>
      )}
    </Link>
  );
}
