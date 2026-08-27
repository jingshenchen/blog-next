/**
 * 按标签名做确定性配色 —— 同一个标签在全站任何位置颜色一致，
 * 新增标签也不用手工指定颜色。
 *
 * 注意：这里必须写成完整的静态 class 字符串，Tailwind 才能在扫描源码时发现它们。
 * 拼接式的 `bg-${color}-50` 会被漏掉。
 */
const TAG_STYLES = [
  "bg-blue-50 text-blue-700 ring-blue-200/70 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-800/50",
  "bg-emerald-50 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800/50",
  "bg-violet-50 text-violet-700 ring-violet-200/70 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-800/50",
  "bg-amber-50 text-amber-700 ring-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800/50",
  "bg-rose-50 text-rose-700 ring-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-800/50",
  "bg-cyan-50 text-cyan-700 ring-cyan-200/70 dark:bg-cyan-950/40 dark:text-cyan-300 dark:ring-cyan-800/50",
  "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200/70 dark:bg-fuchsia-950/40 dark:text-fuchsia-300 dark:ring-fuchsia-800/50",
  "bg-teal-50 text-teal-700 ring-teal-200/70 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-800/50",
];

export function tagStyle(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i += 1) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  }
  return TAG_STYLES[hash % TAG_STYLES.length];
}
