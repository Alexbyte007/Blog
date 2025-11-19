const helloService = require('../services/helloService');

exports.getAllPosts = (req, res) => {
  const { tag, year, month, keyword } = req.query;
  let posts = helloService.getAllPosts();

  if (tag) {
    posts = posts.filter((p) =>
      Array.isArray(p.tags) && p.tags.some((t) => String(t) === String(tag))
    );
  }

  if (year) {
    posts = posts.filter((p) => {
      const d = new Date(p.createdAt);
      return d.getFullYear() === Number(year);
    });
  }

  if (month) {
    posts = posts.filter((p) => {
      const d = new Date(p.createdAt);
      return d.getMonth() + 1 === Number(month);
    });
  }

  if (keyword) {
    const kw = String(keyword).toLowerCase();
    posts = posts.filter((p) => {
      const text = `${p.title || ''} ${p.summary || ''} ${p.content || ''}`.toLowerCase();
      return text.includes(kw);
    });
  }

  res.json(posts);
};

exports.getPostBySlug = (req, res) => {
  const { slug } = req.params;
  const post = helloService.getPostBySlug(slug);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
};

exports.getPostById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const post = helloService.getPostById(id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
};

exports.createPost = (req, res) => {
  const { title, content, author, tags, summary } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const post = helloService.createPost({ title, content, author, tags, summary });
  res.status(201).json(post);
};

exports.updatePost = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, content, author, tags, summary } = req.body;
  const updated = helloService.updatePost(id, { title, content, author, tags, summary });
  if (!updated) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(updated);
};

exports.deletePost = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const ok = helloService.deletePost(id);
  if (!ok) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.status(204).send();
};

exports.incrementViews = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const views = helloService.incrementViews(id);
  if (views == null) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json({ views });
};

exports.getComments = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const comments = helloService.getComments(id);
  if (comments == null) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(comments);
};

exports.addComment = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { author, content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Comment content is required' });
  }
  const comment = helloService.addComment(id, { author, content });
  if (!comment) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.status(201).json(comment);
};
