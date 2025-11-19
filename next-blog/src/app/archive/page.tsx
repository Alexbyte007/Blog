import Link from "next/link";
import { getPosts } from "../../lib/api";

export default async function ArchivePage() {
  const posts = await getPosts();

  const groups = new Map<string, { year: number; month: number; items: typeof posts }>();

  for (const post of posts) {
    if (!post.createdAt) continue;
    const d = new Date(post.createdAt);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const key = `${year}-${month}`;
    if (!groups.has(key)) {
      groups.set(key, { year, month, items: [] });
    }
    groups.get(key)!.items.push(post);
  }

  const archiveList = Array.from(groups.values()).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-white/80 p-6 text-sm shadow-sm ring-1 ring-zinc-100 backdrop-blur dark:bg-zinc-900/80 dark:ring-zinc-800">
      <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">归档</h1>
      {archiveList.length === 0 ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">还没有可以归档的文章。</p>
      ) : (
        <div className="space-y-4">
          {archiveList.map((group) => (
            <div key={`${group.year}-${group.month}`} className="space-y-2">
              <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                {group.year} 年 {group.month} 月
              </h2>
              <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
                {group.items.map((post) => (
                  <li key={post.id}>
                    <span className="mr-2 text-[11px] text-zinc-400">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                    </span>
                    <Link
                      href={`/posts/${post.slug || post.id}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
