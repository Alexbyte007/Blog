"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Post } from "../../lib/api";
import { deletePost, getPosts } from "../../lib/api";

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [keyword, setKeyword] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await getPosts({ keyword, tag });
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("确定要删除这篇文章吗？")) return;
    await deletePost(id);
    await load();
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-white/80 p-6 text-sm shadow-sm ring-1 ring-zinc-100 backdrop-blur dark:bg-zinc-900/80 dark:ring-zinc-800">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">文章管理</h1>
        <Link
          href="/write"
          className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          写新文章
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="按标题/内容搜索"
          className="min-w-[180px] flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
        />
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="按标签筛选，如：架构"
          className="min-w-[120px] rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500"
        />
        <button
          onClick={load}
          className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          搜索
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">加载中...</p>
      ) : posts.length === 0 ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">暂无文章</p>
      ) : (
        <table className="min-w-full table-fixed border-separate border-spacing-y-2 text-xs">
          <thead className="text-zinc-500 dark:text-zinc-400">
            <tr>
              <th className="w-[40%] text-left">标题</th>
              <th className="w-[20%] text-left">创建时间</th>
              <th className="w-[20%] text-left">标签</th>
              <th className="w-[10%] text-right">浏览</th>
              <th className="w-[10%] text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="rounded-2xl bg-zinc-50 text-zinc-700 shadow-sm dark:bg-zinc-900 dark:text-zinc-200">
                <td className="truncate px-3 py-2 align-top">
                  <Link href={`/posts/${post.slug || post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </td>
                <td className="px-3 py-2 align-top">
                  {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                </td>
                <td className="px-3 py-2 align-top">
                  {(post.tags || []).map((tag) => (
                    <span key={tag} className="mr-1 inline-block rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      #{tag}
                    </span>
                  ))}
                </td>
                <td className="px-3 py-2 text-right align-top">{post.views ?? 0}</td>
                <td className="px-3 py-2 text-right align-top">
                  <div className="inline-flex gap-2">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="rounded-full border border-zinc-300 px-2 py-0.5 text-[11px] text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      编辑
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="rounded-full border border-red-300 px-2 py-0.5 text-[11px] text-red-600 hover:bg-red-50 dark:border-red-500/60 dark:text-red-300 dark:hover:bg-red-950/40"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
