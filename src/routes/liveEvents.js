import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// List live events
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT le.id, le.title, le.description, le.event_date, le.start_time,
              le.end_time, u.full_name as speaker_name
       FROM live_events le
       LEFT JOIN users u ON le.speaker_id = u.id
       WHERE le.visibility = 'all'
       ORDER BY le.event_date DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      events: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('List live events error:', error);
    res.status(500).json({ error: 'Failed to fetch live events' });
  }
});

export default router;
