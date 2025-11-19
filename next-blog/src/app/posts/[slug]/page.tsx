import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { getPostBySlug } from "../../../lib/api";
import { PostActions } from "../../../components/PostActions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    return { title: `${post.title} - 我的博客` };
  } catch {
    return { title: "文章未找到" };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    return notFound();
  }
  if (!post) return notFound();

  const headings: { id: string; text: string; level: number }[] = [];

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
      <article className="rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-zinc-100 backdrop-blur dark:bg-zinc-900/80 dark:ring-zinc-800">
        <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
          </span>
          <span>{post.views} 次浏览</span>
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {post.title}
          </h1>
          {post.id != null && (
            <PostActions id={post.id} slug={post.slug || slug} />
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          {(post.tags || []).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="prose prose-zinc mt-6 max-w-none text-sm leading-relaxed dark:prose-invert">
          <ReactMarkdown
            components={{
              h2({ node, children, ...props }) {
                const text = String(children);
                const id = text
                  .toLowerCase()
                  .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
                  .replace(/(^-|-$)+/g, "");
                headings.push({ id, text, level: 2 });
                return (
                  <h2 id={id} {...props}>
                    {children}
                  </h2>
                );
              },
              h3({ node, children, ...props }) {
                const text = String(children);
                const id = text
                  .toLowerCase()
                  .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
                  .replace(/(^-|-$)+/g, "");
                headings.push({ id, text, level: 3 });
                return (
                  <h3 id={id} {...props}>
                    {children}
                  </h3>
                );
              },
              code({ className, children, ...props }) {
                const rawLanguage = (className || "").replace("language-", "");
                const normalizedLanguage =
                  rawLanguage === "ts"
                    ? "typescript"
                    : rawLanguage === "js"
                    ? "javascript"
                    : rawLanguage;
                const code = String(children).trim();
                const grammar =
                  Prism.languages[
                    normalizedLanguage as keyof typeof Prism.languages
                  ] || Prism.languages.tsx;

                if (!grammar) {
                  return (
                    <pre className="rounded-2xl bg-zinc-900/95 p-4 text-xs text-zinc-100 shadow-inner">
                      <code className={className} {...props}>
                        {code}
                      </code>
                    </pre>
                  );
                }

                const html = Prism.highlight(code, grammar, normalizedLanguage);
                return (
                  <pre className="rounded-2xl bg-zinc-900/95 p-4 text-xs text-zinc-100 shadow-inner">
                    <code
                      className={className}
                      dangerouslySetInnerHTML={{ __html: html }}
                      {...props}
                    />
                  </pre>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <aside className="space-y-4 rounded-3xl bg-white/80 p-4 text-sm shadow-sm ring-1 ring-zinc-100 backdrop-blur dark:bg-zinc-900/80 dark:ring-zinc-800">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            目录
          </h2>
          <nav className="mt-2 space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className={`block rounded-lg px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                  h.level === 3 ? "pl-4 text-[11px]" : ""
                }`}
              >
                {h.text}
              </a>
            ))}
            {!headings.length && <p className="text-zinc-400">暂无标题</p>}
          </nav>
        </div>
      </aside>
    </div>
  );
}
