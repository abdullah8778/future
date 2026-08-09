import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get member profile
router.get('/:memberId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.country, u.city, u.profile_photo_url,
              mp.professional_title, mp.organization, mp.specialty, mp.biography,
              array_agg(r.name) as roles
       FROM users u
       LEFT JOIN member_profiles mp ON u.id = mp.user_id
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.id = $1 AND u.is_active = true
       GROUP BY u.id, mp.id`,
      [req.params.memberId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ error: 'Failed to fetch member profile' });
  }
});

// List members
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT u.id, u.full_name, u.profile_photo_url,
              mp.professional_title, mp.organization, mp.specialty
       FROM users u
       LEFT JOIN member_profiles mp ON u.id = mp.user_id
       WHERE u.is_active = true
       ORDER BY u.full_name
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      members: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('List members error:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Update own profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { professional_title, organization, specialty, biography } = req.body;

    // Check if profile exists
    const exists = await pool.query(
      'SELECT id FROM member_profiles WHERE user_id = $1',
      [req.userId]
    );

    if (exists.rows.length > 0) {
      await pool.query(
        `UPDATE member_profiles SET professional_title = $1, organization = $2, specialty = $3,
                biography = $4, updated_at = CURRENT_TIMESTAMP WHERE user_id = $5`,
        [professional_title, organization, specialty, biography, req.userId]
      );
    } else {
      await pool.query(
        `INSERT INTO member_profiles (id, user_id, professional_title, organization, specialty, biography)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [uuidv4(), req.userId, professional_title, organization, specialty, biography]
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
