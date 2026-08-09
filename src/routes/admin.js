import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Dashboard overview
router.get(
  '/dashboard',
  authenticateToken,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  async (req, res) => {
    try {
      const totalMembers = await pool.query(
        'SELECT COUNT(*) FROM users WHERE is_active = true'
      );

      const pendingApplications = await pool.query(
        "SELECT COUNT(*) FROM applications WHERE status = 'submitted'"
      );

      const underReview = await pool.query(
        "SELECT COUNT(*) FROM applications WHERE status = 'under_review'"
      );

      const approved = await pool.query(
        "SELECT COUNT(*) FROM applications WHERE status = 'approved'"
      );

      const rejected = await pool.query(
        "SELECT COUNT(*) FROM applications WHERE status = 'rejected'"
      );

      res.json({
        total_members: parseInt(totalMembers.rows[0].count),
        pending_applications: parseInt(pendingApplications.rows[0].count),
        under_review: parseInt(underReview.rows[0].count),
        approved: parseInt(approved.rows[0].count),
        rejected: parseInt(rejected.rows[0].count)
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  }
);

// List applications
router.get(
  '/applications',
  authenticateToken,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  async (req, res) => {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      let query = 'SELECT * FROM applications';
      const params = [];

      if (status) {
        query += ' WHERE status = $' + (params.length + 1);
        params.push(status);
      }

      query += ' ORDER BY submitted_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);

      const result = await pool.query(query, params);

      res.json({
        applications: result.rows,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    } catch (error) {
      console.error('List applications error:', error);
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }
);

// Update application status
router.patch(
  '/applications/:applicationId',
  authenticateToken,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  async (req, res) => {
    try {
      const { status, internal_notes, rejection_reason } = req.body;

      const result = await pool.query(
        `UPDATE applications SET status = $1, internal_notes = $2, rejection_reason = $3, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = $4 WHERE id = $5 RETURNING *`,
        [status, internal_notes, rejection_reason, req.userId, req.params.applicationId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Application not found' });
      }

      res.json({
        message: 'Application updated',
        application: result.rows[0]
      });
    } catch (error) {
      console.error('Update application error:', error);
      res.status(500).json({ error: 'Failed to update application' });
    }
  }
);

export default router;
