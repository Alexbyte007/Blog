const { posts } = require('../data/helloData');

let nextId = posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1;

exports.findAll = () => {
  return posts;
};

exports.findById = (id) => {
  return posts.find((p) => p.id === id) || null;
};

exports.findBySlug = (slug) => {
  return posts.find((p) => p.slug === slug) || null;
};

exports.create = ({ title, content, author, tags, summary }) => {
  const now = new Date().toISOString();
  const baseSlug = String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/(^-|-$)+/g, '') || `post-${nextId}`;
  const post = {
    id: nextId++,
    title,
    slug: baseSlug,
    summary: summary || '',
    content,
    author: author || '匿名',
    tags: tags || [],
    views: 0,
    comments: [],
    createdAt: now,
    updatedAt: now,
  };
  posts.push(post);
  return post;
};

exports.update = (id, { title, content, author, tags, summary }) => {
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const existing = posts[index];
  const updated = {
    ...existing,
    title: title ?? existing.title,
    summary: summary ?? existing.summary,
    content: content ?? existing.content,
    author: author ?? existing.author,
    tags: tags ?? existing.tags,
    updatedAt: new Date().toISOString(),
  };
  posts[index] = updated;
  return updated;
};

exports.remove = (id) => {
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return false;
  posts.splice(index, 1);
  return true;
};

exports.incrementViews = (id) => {
  const post = posts.find((p) => p.id === id);
  if (!post) return null;
  post.views = (post.views || 0) + 1;
  return post.views;
};

exports.getComments = (id) => {
  const post = posts.find((p) => p.id === id);
  if (!post) return null;
  return post.comments || [];
};

exports.addComment = (id, { author, content }) => {
  const post = posts.find((p) => p.id === id);
  if (!post) return null;
  if (!post.comments) post.comments = [];
  const nextCommentId = post.comments.length
    ? Math.max(...post.comments.map((c) => c.id)) + 1
    : 1;
  const comment = {
    id: nextCommentId,
    author: author || '匿名',
    content,
    createdAt: new Date().toISOString(),
  };
  post.comments.push(comment);
  return comment;
};
