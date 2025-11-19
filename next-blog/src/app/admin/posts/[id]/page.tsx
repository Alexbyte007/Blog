"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Post } from "../../../../lib/api";
import { getPostById, updatePost } from "../../../../lib/api";

export default function AdminEditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;
    (async () => {
      try {
        const p = await getPostById(id);
        setPost(p);
        setTitle(p.title || "");
        setSummary(p.summary || "");
        setContent(p.content || "");
        setTags((p.tags || []).join(", "));
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  async function handleSave() {
    if (!post) return;
    if (!title.trim() || !content.trim()) {
      alert("标题和正文不能为空");
      return;
    }

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await updatePost(post.id, {
      title: title.trim(),
      summary: summary.trim() || content.slice(0, 60),
      content,
      tags: tagList,
      author: post.author,
    });

    alert("保存成功");
    router.push("/admin");
  }

  if (loading) {
    return <p className="text-xs text-zinc-500 dark:text-zinc-400">正在加载文章...</p>;
  }

  if (!post) {
    return <p className="text-xs text-red-500">文章不存在</p>;
  }

  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-white/80 p-6 text-sm shadow-sm ring-1 ring-zinc-100 backdrop-blur dark:bg-zinc-900/80 dark:ring-zinc-800">
      <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">编辑文章</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-zinc-600 dark:text-zinc-300">标题</label>
          <input
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-zinc-600 dark:text-zinc-300">摘要</label>
          <textarea
            className="min-h-[60px] rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-zinc-600 dark:text-zinc-300">标签（用逗号分隔）</label>
          <input
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-zinc-600 dark:text-zinc-300">正文</label>
          <textarea
            className="min-h-[160px] rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-full border border-zinc-300 px-4 py-2 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            onClick={() => router.back()}
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-zinc-900 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
