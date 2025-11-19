export type PostInput = {
  title: string;
  summary?: string;
  content: string;
  tags?: string[];
  author?: string;
};

const BASE_URL = "http://localhost:3001";

export async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export type Post = {
  id: number;
  title: string;
  slug?: string;
  summary?: string; // 对应后端的 summary
  excerpt?: string; // 兼容旧代码，如果需要可以映射为 summary
  content: string;
  author?: string;
  tags?: string[];
  views?: number;
  createdAt?: string;
  updatedAt?: string;
};

export async function getPosts(params?: {
  tag?: string;
  year?: string;
  month?: string;
  keyword?: string;
}): Promise<Post[]> {
  const qs = new URLSearchParams();
  if (params?.tag) qs.set("tag", params.tag);
  if (params?.year) qs.set("year", params.year);
  if (params?.month) qs.set("month", params.month);
  if (params?.keyword) qs.set("keyword", params.keyword);
  const query = qs.toString();
  const path = query ? `/api/posts?${query}` : "/api/posts";
  return fetchJSON<Post[]>(path);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return fetchJSON<Post>(`/api/posts/slug/${encodeURIComponent(slug)}`);
}

export async function getPostById(id: number): Promise<Post> {
  return fetchJSON<Post>(`/api/posts/${id}`);
}

export async function createPost(input: PostInput): Promise<Post> {
  return fetchJSON<Post>("/api/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updatePost(id: number, input: PostInput): Promise<Post> {
  return fetchJSON<Post>(`/api/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deletePost(id: number): Promise<void> {
  await fetchJSON<void>(`/api/posts/${id}`, {
    method: "DELETE",
  });
}
