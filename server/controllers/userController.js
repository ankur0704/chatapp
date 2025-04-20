import User from '../models/User.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const currentUser = req.user._id;
    
    const users = await User.find({ _id: { $ne: currentUser } })
      .select('username email profilePicture status lastSeen');
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username email profilePicture status lastSeen');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { username, profilePicture } = req.body;
    const userId = req.user._id;

    // Check if username already exists
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          username: username || req.user.username,
          profilePicture: profilePicture || req.user.profilePicture
        } 
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user._id;

    if (!['online', 'offline'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          status,
          lastSeen: status === 'offline' ? Date.now() : req.user.lastSeen
        } 
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};