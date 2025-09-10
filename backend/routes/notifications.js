const express = require('express');
const { neon } = require('@neondatabase/serverless');
const router = express.Router();

const sql = neon(process.env.DATABASE_URL);

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { user_id, is_read, type } = req.query;

    let query = `
      SELECT n.*, u.name as sender_name
      FROM notifications n
      LEFT JOIN users u ON n.sender_id = u.id
    `;

    const conditions = [];
    const params = [];

    if (user_id) {
      conditions.push(`n.user_id = $${params.length + 1}`);
      params.push(user_id);
    }

    if (is_read !== undefined) {
      conditions.push(`n.is_read = $${params.length + 1}`);
      params.push(is_read === 'true');
    }

    if (type) {
      conditions.push(`n.type = $${params.length + 1}`);
      params.push(type);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY n.created_at DESC LIMIT 50`;

    const notifications = await sql.unsafe(query, params);

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/notifications
// @desc    Create new notification
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      sender_id,
      type,
      title,
      message,
      related_id,
      related_type
    } = req.body;

    if (!user_id || !type || !title || !message) {
      return res.status(400).json({ 
        message: 'User ID, type, title, and message are required' 
      });
    }

    const newNotification = await sql`
      INSERT INTO notifications (
        user_id, sender_id, type, title, message, related_id, related_type
      )
      VALUES (
        ${user_id}, ${sender_id}, ${type}, ${title}, ${message}, ${related_id}, ${related_type}
      )
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newNotification[0]
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedNotification = await sql`
      UPDATE notifications SET
        is_read = true,
        read_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedNotification.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({
      success: true,
      data: updatedNotification[0]
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read for user
// @access  Private
router.put('/mark-all-read', async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    await sql`
      UPDATE notifications SET
        is_read = true,
        read_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${user_id} AND is_read = false
    `;

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNotification = await sql`
      DELETE FROM notifications WHERE id = ${id}
      RETURNING *
    `;

    if (deletedNotification.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count for user
// @access  Private
router.get('/unread-count', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const result = await sql`
      SELECT COUNT(*) as unread_count
      FROM notifications
      WHERE user_id = ${user_id} AND is_read = false
    `;

    res.json({
      success: true,
      data: {
        unread_count: parseInt(result[0].unread_count)
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Utility function to create notifications
const createNotification = async (data) => {
  try {
    const notification = await sql`
      INSERT INTO notifications (
        user_id, sender_id, type, title, message, related_id, related_type
      )
      VALUES (
        ${data.user_id}, ${data.sender_id}, ${data.type}, 
        ${data.title}, ${data.message}, ${data.related_id}, ${data.related_type}
      )
      RETURNING *
    `;
    return notification[0];
  } catch (error) {
    console.error('Create notification error:', error);
    return null;
  }
};

// Export utility function for use in other routes
router.createNotification = createNotification;

module.exports = router;
