import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { authenticateToken, authorizePermission } from '../middleware/auth.js';

const router = express.Router();

// List announcements
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT a.id, a.title, a.body, a.category, a.published_date, a.is_pinned,
              u.full_name as created_by
       FROM announcements a
       LEFT JOIN users u ON a.created_by = u.id
       WHERE a.visibility = 'all' OR a.expires_at IS NULL OR a.expires_at > CURRENT_TIMESTAMP
       ORDER BY a.is_pinned DESC, a.published_date DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      announcements: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('List announcements error:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Create announcement
router.post(
  '/',
  authenticateToken,
  authorizePermission('create_announcements'),
  async (req, res) => {
    try {
      const { title, body, category, visibility } = req.body;
      const announcementId = uuidv4();

      await pool.query(
        `INSERT INTO announcements (id, title, body, category, visibility, created_by)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [announcementId, title, body, category, visibility, req.userId]
      );

      res.status(201).json({
        message: 'Announcement created',
        id: announcementId
      });
    } catch (error) {
      console.error('Create announcement error:', error);
      res.status(500).json({ error: 'Failed to create announcement' });
    }
  }
);

export default router;
