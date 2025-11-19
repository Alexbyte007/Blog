import Link from "next/link";
import { getPosts } from "../../lib/api";

export default async function TagsPage() {
  const posts = await getPosts();
  const tagCount = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags || []) {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    }
  }

  const tags = Array.from(tagCount.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-white/80 p-6 text-sm shadow-sm ring-1 ring-zinc-100 backdrop-blur dark:bg-zinc-900/80 dark:ring-zinc-800">
      <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">标签</h1>
      {tags.length === 0 ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">暂时还没有标签。</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 shadow-sm hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              #{tag} <span className="text-[10px] text-zinc-500">{count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
