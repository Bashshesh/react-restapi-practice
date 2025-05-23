const express = require('express');
const session = require('cookie-session');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(
  session({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

let users = [];
let posts = [];

app.post('/users', (req, res) => {
  const { username, email, password } = req.body;
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = { id: users.length + 1, username, email, password };
  users.push(user);
  res.status(201).json({ id: user.id, username, email });
});

app.get('/users', (req, res) => {
  const usersList = users.map(({ id, username, email }) => ({ id, username, email }));
  res.json(usersList);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  req.session.userId = user.id;
  res.json({ id: user.id, username: user.username, email: user.email });
});

app.get('/me', (req, res) => {
  const userId = req.session.userId;
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json({ id: user.id, username: user.username, email: user.email });
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.json({ message: 'Logged out' });
});

app.post('/posts', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const { title, content } = req.body;
  const post = {
    id: posts.length + 1,
    title,
    content,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,          // Add this
    likedUsers: [],    // Add this
  };
  posts.push(post);
  res.status(201).json(post);
});

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/api/posts/:postId/like', (req, res) => {
  const { postId } = req.params;
  const userId = req.session.userId; // Use session-based auth

  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const post = posts.find((p) => p.id === parseInt(postId));
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Initialize likes and likedUsers if not present
  post.likes = post.likes || 0;
  post.likedUsers = post.likedUsers || [];

  if (post.likedUsers.includes(userId)) {
    return res.status(400).json({ message: 'Already liked' });
  }

  post.likedUsers.push(userId);
  post.likes += 1;

  res.json({ postId, likes: post.likes });
});

app.post('/api/posts/:postId/unlike', (req, res) => { 
  const { postId } = req.params;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const post = posts.find((p) => p.id === parseInt(postId));
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  post.likes = post.likes || 0;
  post.likedUsers = post.likedUsers || [];

  if (!post.likedUsers.includes(userId)) {
    return res.status(400).json({ message: 'Not liked yet' });
  }

  post.likedUsers = post.likedUsers.filter((id) => id !== userId);
  post.likes -= 1;

  res.json(post); // Return the full post object
});

app.delete('/posts/:postId', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const postId = parseInt(req.params.postId, 10);
  const postIndex = posts.findIndex((p) => p.id === postId && p.userId === userId);
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found or not authorized' });
  }
  posts.splice(postIndex, 1);
  res.status(204).send();
});

app.options('*', cors());

app.put('/posts/:postId', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const postId = parseInt(req.params.postId, 10);
  const { title, content } = req.body;
  const post = posts.find((p) => p.id === postId && p.userId === userId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found or not authorized' });
  }
  post.title = title || post.title;
  post.content = content || post.content;
  res.json(post);
});

app.options('*', cors());

app.get('/posts', (req, res) => {
  res.json(posts); // Ensure posts include { id, title, content, userId, createdAt, updatedAt, likes, likedUsers }
});


console.log('Registered routes:');
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`${r.route.stack[0].method.toUpperCase()} ${r.route.path}`);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});