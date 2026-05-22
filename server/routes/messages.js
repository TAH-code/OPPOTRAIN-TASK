const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/messages/:channelId — get messages for a channel
router.get('/:channelId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ channel: req.params.channelId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 })
      .limit(50);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
