"use client";

import { useRouter } from "next/navigation";
import { deletePost } from "../lib/api";

export function PostActions({ id, slug }: { id: number; slug: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("确定要删除这篇文章吗？")) return;
    try {
      await deletePost(id);
      alert("删除成功");
      router.push("/admin");
    } catch (err) {
      console.error("删除失败", err);
      alert("删除失败，请检查后端是否正常运行。");
    }
  }

  return (
    <div className="mt-4 flex justify-end gap-2 text-xs">
      <button
        type="button"
        onClick={() => router.push(`/admin/posts/${id}`)}
        className="rounded-full border border-zinc-300 px-3 py-1 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        编辑
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="rounded-full border border-red-300 px-3 py-1 text-red-600 hover:bg-red-50 dark:border-red-500/60 dark:text-red-300 dark:hover:bg-red-950/40"
      >
        删除
      </button>
    </div>
  );
}
