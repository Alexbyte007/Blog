export type Post = {
  id: number;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  views: number;
};

export const posts: Post[] = [
  {
    id: 1,
    title: "搭建一个几何简约风格的 Next.js 博客",
    slug: "minimal-nextjs-blog",
    date: "2025-11-19",
    excerpt: "使用 Next.js、Tailwind CSS 和暗色模式，构建一个几何简约的个人博客界面。",
    tags: ["Next.js", "Tailwind", "UI"],
    views: 123,
    content: `# 搭建一个几何简约风格的 Next.js 博客

这是正文示例，使用 **Markdown** 语法。

## 使用的技术

- Next.js App Router
- Tailwind CSS
- React Markdown + Prism.js 代码高亮

## 示例代码

\`\`\`ts
export function hello(): string {
  console.log("Hello from Prism highlighted code!");
  return "hello";
}
\`\`\`

`,
  },
  {
    id: 2,
    title: "为什么博客需要暗色模式",
    slug: "why-dark-mode",
    date: "2025-11-10",
    excerpt: "暗色模式不仅仅是好看，还能在夜间阅读时保护眼睛，让界面更具现代感。",
    tags: ["UX", "Design"],
    views: 88,
    content: `# 为什么博客需要暗色模式

暗色模式可以减轻夜间阅读负担，让 UI 更具科技感。

## 场景

- 夜间刷博客
- OLED 屏幕节省电量

## 代码示例

\`\`\`ts
export function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
}
\`\`\`

`,
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPaginatedPosts(page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = posts.slice(start, end);
  const totalPages = Math.ceil(posts.length / pageSize) || 1;
  return { items, totalPages };
}
