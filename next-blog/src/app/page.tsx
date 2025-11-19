"use client";

import { useEffect, useMemo, useState } from "react";
import { PostCard } from "../components/PostCard";
import type { Post } from "../lib/api";
import { getPosts } from "../lib/api";

const PAGE_SIZE = 5;

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const page = 1;

  useEffect(() => {
    (async () => {
      const data = await getPosts();
      setPosts(data);
    })();
  }, []);

  const combinedPosts = useMemo(() => {
    const merged = [...posts];
    return merged.sort((a, b) => {
      const ad = a.createdAt || "";
      const bd = b.createdAt || "";
      return ad < bd ? 1 : -1;
    });
  }, [posts]);

  const totalPages = Math.ceil(combinedPosts.length / PAGE_SIZE) || 1;
  const latestPosts = combinedPosts.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      {/* 顶部个人主页 Hero 区域 */}
      <section className="grid gap-6 rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-zinc-100 backdrop-blur dark:bg-zinc-900/80 dark:ring-zinc-800 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex flex-col justify-center gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            PERSONAL BLOG · NEXT.JS · TAILWIND
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-3xl">
            欢迎来到我的创作空间
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            这里记录了关于前端、后端、系统设计和生活随笔的思考。你可以在这里阅读文章、查看标签归档，或者直接写下一篇新的博客。
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            <a
              href="/write"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-1.5 font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              写一篇新文章
            </a>
            <a
              href="/tags"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              按标签浏览
            </a>
            <a
              href="/archive"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-4 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              查看归档
            </a>
          </div>
        </div>

        <div className="hidden items-center justify-center md:flex">
          <div className="relative h-40 w-40 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-400 shadow-xl dark:from-zinc-100 dark:via-zinc-500 dark:to-zinc-900">
            <div className="absolute inset-4 rounded-[2rem] bg-gradient-to-br from-white/80 to-zinc-100/60 shadow-inner dark:from-zinc-950/80 dark:to-zinc-900/80" />
            <div className="absolute inset-4 flex flex-col items-center justify-center gap-2 text-xs text-zinc-700 dark:text-zinc-200">
              <span className="rounded-full bg-zinc-900 px-3 py-0.5 text-[11px] font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                博客概览
              </span>
              <span>文章数：{combinedPosts.length}</span>
              <span>
                总浏览：
                {combinedPosts.reduce((sum, p) => sum + (p.views || 0), 0)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 最新文章预览 */}
      <section className="flex flex-col gap-3 rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-zinc-100 backdrop-blur dark:bg-zinc-900/80 dark:ring-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              最新文章
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              只展示最近的几篇，更多内容可以前往标签或归档页查看。
            </p>
          </div>
          <a
            href="/archive"
            className="text-xs text-zinc-600 hover:underline dark:text-zinc-300"
          >
            查看全部文章
          </a>
        </div>

        {latestPosts.length === 0 ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">暂时还没有文章，去写一篇吧～</p>
        ) : (
          <div className="mt-2 grid gap-4">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post as any} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
