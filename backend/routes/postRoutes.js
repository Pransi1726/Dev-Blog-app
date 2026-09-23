import express from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db.js';

const router = express.Router();

// Get all posts (newest first)
router.get('/', async (req, res) => {
  try {
    const posts = [...db.data.posts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.status(200).json(posts);
  } catch (error) {
    console.error('GET /api/posts error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get a single post
router.get('/:id', async (req, res) => {
  const post = db.data.posts.find((p) => p._id === req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.status(200).json(post);
});

// Create a post
router.post('/', async (req, res) => {
  const { title, content, author, imageUrl } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }
  try {
    const now = new Date().toISOString();
    const newPost = {
      _id: randomUUID(),
      title,
      content,
      author: author || 'Anonymous',
      imageUrl: imageUrl || 'https://via.placeholder.com/600x300',
      createdAt: now,
      updatedAt: now,
    };
    db.data.posts.push(newPost);
    await db.write();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('POST /api/posts error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update a post
router.put('/:id', async (req, res) => {
  const index = db.data.posts.findIndex((p) => p._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Post not found' });
  try {
    db.data.posts[index] = {
      ...db.data.posts[index],
      ...req.body,
      _id: db.data.posts[index]._id, // never allow the id to be overwritten
      updatedAt: new Date().toISOString(),
    };
    await db.write();
    res.status(200).json(db.data.posts[index]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  const index = db.data.posts.findIndex((p) => p._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Post not found' });
  try {
    db.data.posts.splice(index, 1);
    await db.write();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
