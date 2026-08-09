import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// List discussions
router.get('/', async (req, res) => {
  try {
    const { topic, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT d.id, d.title, d.description, d.topic, d.created_at,
                        u.full_name as created_by FROM discussions d
                 LEFT JOIN users u ON d.created_by = u.id`;
    const params = [];

    if (topic) {
      query += ' WHERE d.topic = $1';
      params.push(topic);
    }

    query += ' ORDER BY d.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      discussions: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('List discussions error:', error);
    res.status(500).json({ error: 'Failed to fetch discussions' });
  }
});

// Create discussion
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, topic } = req.body;

    if (!title || !topic) {
      return res.status(400).json({ error: 'Title and topic required' });
    }

    const discussionId = uuidv4();

    await pool.query(
      `INSERT INTO discussions (id, title, description, topic, created_by) VALUES ($1, $2, $3, $4, $5)`,
      [discussionId, title, description, topic, req.userId]
    );

    res.status(201).json({ message: 'Discussion created', id: discussionId });
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({ error: 'Failed to create discussion' });
  }
});

export default router;
