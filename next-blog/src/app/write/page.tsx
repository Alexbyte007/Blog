"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Post } from "../../lib/api";
import { createPost } from "../../lib/api";

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const DRAFT_KEY = "next-blog-write-draft";

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as {
        title?: string;
        summary?: string;
        content?: string;
        tags?: string;
      };
      if (draft.title) setTitle(draft.title);
      if (draft.summary) setExcerpt(draft.summary);
      if (draft.content) setContent(draft.content);
      if (draft.tags) setTags(draft.tags);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const draft = {
      title,
      summary: excerpt,
      content,
      tags,
    };
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [title, excerpt, content, tags]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("标题和正文不能为空");
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const newPost = await createPost({
        title: title.trim(),
        summary: excerpt.trim() || content.slice(0, 60),
        content,
        tags: tagList,
        author: "Alex",
      });

      alert("发布成功！");
      window.localStorage.removeItem(DRAFT_KEY);
      const slug = newPost.slug || String(newPost.id);
      router.push(`/posts/${slug}`);
    } catch (err: any) {
      console.error("发布文章失败", err);
      alert("发布失败，请稍后重试。可以检查后端 http://localhost:3001 是否正在运行。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-zinc-100 backdrop-blur dark:bg-zinc-900/80 dark:ring-zinc-800">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        写一篇新文章
      </h1>
      <div className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-1">
          <label className="text-zinc-600 dark:text-zinc-300">标题</label>
          <input
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入文章标题"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-zinc-600 dark:text-zinc-300">摘要（可选）</label>
          <textarea
            className="min-h-[60px] rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="用于在列表中展示的一小段简介"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-zinc-600 dark:text-zinc-300">标签（用逗号分隔，可选）</label>
          <input
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="例如：Next.js, 生活随笔"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-zinc-600 dark:text-zinc-300">正文（支持 Markdown）</label>
            <div className="flex gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              <button
                type="button"
                className="rounded-full border border-zinc-300 px-2 py-0.5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                onClick={() =>
                  setContent((prev) => `${prev}\n\n\n
\`\`\`ts\n// 在这里编写示例代码\n\`\`\``)
                }
              >
                插入代码块
              </button>
              <button
                type="button"
                className="rounded-full border border-zinc-300 px-2 py-0.5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                onClick={() =>
                  setContent((prev) => `${prev}\n\n![](https://example.com/your-image.png)`)
                }
              >
                插入图片
              </button>
            </div>
          </div>
          <textarea
            className="min-h-[160px] rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# 标题\n\n写点什么吧..."
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
            type="submit"
            disabled={submitting}
            className="rounded-full bg-zinc-900 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {submitting ? "发布中..." : "发布"}
          </button>
        </div>
        </form>

        <section className="hidden min-h-[260px] rounded-3xl bg-zinc-50 p-4 text-sm text-zinc-700 shadow-inner dark:bg-zinc-950/60 dark:text-zinc-200 md:block">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            实时预览
          </h2>
          {content.trim() ? (
            <div className="prose prose-zinc max-w-none text-sm leading-relaxed dark:prose-invert">
              <ReactMarkdown>{`# ${title || "(未命名)"}\n\n${content}`}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-xs text-zinc-400">开始输入正文后，这里会实时显示 Markdown 预览。</p>
          )}
        </section>
      </div>
    </div>
  );
}
