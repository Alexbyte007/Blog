import Link from "next/link";
import type { Post } from "../lib/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}</span>
        <span>{post.views} 次浏览</span>
      </div>
      <h2 className="mt-3 text-lg font-semibold tracking-tight text-zinc-950 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
        {post.summary || post.excerpt}
      </p>
      <div className="mt-3 flex flex-wrap gap-1">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
