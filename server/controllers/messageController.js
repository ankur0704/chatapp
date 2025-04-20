import Message from '../models/Message.js';
import User from '../models/User.js';

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { recipient, content } = req.body;
    const sender = req.user._id;

    // Check if recipient exists
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const message = new Message({
      sender,
      recipient,
      content
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get conversation between two users
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUser, recipient: userId },
        { sender: userId, recipient: currentUser }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'username profilePicture')
    .populate('recipient', 'username profilePicture');

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, recipient: currentUser, read: false },
      { read: true, readAt: Date.now() }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all users the current user has exchanged messages with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { recipient: userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", userId] },
              "$recipient",
              "$sender"
            ]
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ["$recipient", userId] },
                  { $eq: ["$read", false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails"
      },
      {
        $project: {
          _id: 1,
          username: "$userDetails.username",
          profilePicture: "$userDetails.profilePicture",
          status: "$userDetails.status",
          lastMessage: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { "lastMessage.createdAt": -1 }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    await Message.updateMany(
      { _id: { $in: messageIds }, recipient: req.user._id },
      { read: true, readAt: Date.now() }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};