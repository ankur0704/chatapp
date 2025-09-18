import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';

export const sendFriendRequest = async (req, res) => {
  try {
    const requesterId = req.user._id;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ message: 'recipientId is required' });
    }
    if (String(requesterId) === String(recipientId)) {
      return res.status(400).json({ message: 'You cannot send a request to yourself' });
    }

    const recipientUser = await User.findById(recipientId).select('_id');
    if (!recipientUser) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Upsert-or-fail if already exists
    const existing = await FriendRequest.findOne({ requester: requesterId, recipient: recipientId });
    if (existing) {
      return res.status(200).json({ success: true, status: existing.status, message: 'Request already exists' });
    }

    const request = await FriendRequest.create({ requester: requesterId, recipient: recipientId });
    return res.status(201).json({ success: true, request });
  } catch (error) {
    // Handle duplicate unique index race condition
    if (error?.code === 11000) {
      return res.status(200).json({ success: true, message: 'Request already exists' });
    }
    return res.status(500).json({ message: error.message });
  }
};


