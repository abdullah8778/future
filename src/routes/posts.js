import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// List posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT p.id, p.title, p.content, p.created_at,
              u.id as author_id, u.full_name as author_name
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.status = 'published'
       ORDER BY p.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      posts: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('List posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content required' });
    }

    const postId = uuidv4();

    await pool.query(
      `INSERT INTO posts (id, author_id, content, status) VALUES ($1, $2, $3, $4)`,
      [postId, req.userId, content, 'published']
    );

    res.status(201).json({ message: 'Post created', id: postId });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

export default router;
