const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { user_id, is_read, type } = req.query;

    const filter = {};
    if (user_id) filter.user_id = user_id;
    if (is_read !== undefined) filter.is_read = is_read === 'true';
    if (type) filter.type = type;

    const notifications = await Notification.find(filter)
      .populate('sender_id', 'name')
      .sort({ created_at: -1 })
      .limit(50);

    res.json({ success: true, data: notifications });
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
    const { user_id, sender_id, type, title, message, related_id, related_type } = req.body;

    if (!user_id || !type || !title || !message) {
      return res.status(400).json({ message: 'User ID, type, title, and message are required' });
    }

    const newNotification = await Notification.create({
      user_id,
      sender_id,
      type,
      title,
      message,
      related_id,
      related_type,
    });

    res.status(201).json({ success: true, data: newNotification });
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

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { is_read: true, read_at: new Date(), updated_at: new Date() },
      { new: true }
    );

    if (!updatedNotification) return res.status(404).json({ message: 'Notification not found' });

    res.json({ success: true, data: updatedNotification });
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
    if (!user_id) return res.status(400).json({ message: 'User ID is required' });

    await Notification.updateMany(
      { user_id, is_read: false },
      { is_read: true, read_at: new Date(), updated_at: new Date() }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
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

    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) return res.status(404).json({ message: 'Notification not found' });

    res.json({ success: true, message: 'Notification deleted successfully' });
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
    if (!user_id) return res.status(400).json({ message: 'User ID is required' });

    const unread_count = await Notification.countDocuments({ user_id, is_read: false });

    res.json({ success: true, data: { unread_count } });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Utility function to create notifications from other modules
const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    return null;
  }
};

router.createNotification = createNotification;

module.exports = router;
