const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Set up EJS view engine and static files
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Temporary in-memory storage
let posts = [];

// 🏠 Home Route - View & Filter Posts
app.get('/', (req, res) => {
  const filter = req.query.filter;
  const filteredPosts = filter ? posts.filter(p => p.category === filter) : posts;
  res.render('index', { posts: filteredPosts });
});

// 📝 Create New Post
app.post('/create', (req, res) => {
  const { title, content, author, category } = req.body;
  const newPost = {
    id: Date.now(),
    title,
    content,
    author,
    category,
    timestamp: new Date().toLocaleString()
  };
  posts.push(newPost);
  res.redirect('/');
});

// ✏️ Edit Post - Load Form
app.get('/edit/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).send('Post not found');
  res.render('edit', { post });
});

// 🔄 Edit Post - Submit Changes
app.post('/edit/:id', (req, res) => {
  const { title, content, author, category } = req.body;
  const postIndex = posts.findIndex(p => p.id == req.params.id);
  if (postIndex === -1) return res.status(404).send('Post not found');

  posts[postIndex] = {
    ...posts[postIndex],
    title,
    content,
    author,
    category,
    timestamp: new Date().toLocaleString()
  };
  res.redirect('/');
});

// 🗑️ Delete Post
app.get('/delete/:id', (req, res) => {
  posts = posts.filter(p => p.id != req.params.id);
  res.redirect('/');
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

