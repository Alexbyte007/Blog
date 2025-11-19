const express = require('express');
const app = express();
const port = 3001;

// Simple 3-layer example wired via controller/service/repository
const helloController = require('./controllers/helloController');

app.use(express.json());

// Allow CORS from Next.js dev server on http://localhost:3000
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Serve static frontend files from the public folder
app.use(express.static('public'));

// API routes for blog posts (three-layer architecture: controller -> service -> repository -> data)
app.get('/api/posts', helloController.getAllPosts);
app.get('/api/posts/slug/:slug', helloController.getPostBySlug);
app.get('/api/posts/:id', helloController.getPostById);
app.post('/api/posts', helloController.createPost);
app.put('/api/posts/:id', helloController.updatePost);
app.delete('/api/posts/:id', helloController.deletePost);
app.post('/api/posts/:id/view', helloController.incrementViews);
app.get('/api/posts/:id/comments', helloController.getComments);
app.post('/api/posts/:id/comments', helloController.addComment);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
