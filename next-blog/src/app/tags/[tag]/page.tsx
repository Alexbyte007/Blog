import { PostCard } from "../../../components/PostCard";
import { getPosts } from "../../../lib/api";

export default async function TagDetailPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const posts = await getPosts({ tag });

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-3xl bg-white/80 p-6 text-sm shadow-sm ring-1 ring-zinc-100 backdrop-blur dark:bg-zinc-900/80 dark:ring-zinc-800">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">标签：#{tag}</h1>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">共 {posts.length} 篇文章</p>
      </section>

      <section className="grid gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post as any} />
        ))}
      </section>
    </div>
  );
}
