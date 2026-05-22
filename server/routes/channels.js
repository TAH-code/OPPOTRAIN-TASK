const express = require('express');
const Channel = require('../models/Channel');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/channels — list all channels
router.get('/', auth, async (req, res) => {
  try {
    const channels = await Channel.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: 1 });

    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/channels — create a new channel
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if channel name already exists
    const existingChannel = await Channel.findOne({ name: name.toLowerCase().replace(/\s+/g, '-') });
    if (existingChannel) {
      return res.status(400).json({ message: 'Channel name already exists' });
    }

    const channel = new Channel({
      name: name.toLowerCase().replace(/\s+/g, '-'),
      description: description || '',
      members: [req.user._id],
      createdBy: req.user._id,
    });

    await channel.save();
    await channel.populate('createdBy', 'username');

    res.status(201).json(channel);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/channels/:id/join — join a channel
router.put('/:id/join', auth, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check if user is already a member
    if (channel.members.includes(req.user._id)) {
      return res.json(channel);
    }

    channel.members.push(req.user._id);
    await channel.save();
    await channel.populate('createdBy', 'username');

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
