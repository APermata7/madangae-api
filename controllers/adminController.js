// controllers/adminController.js
const Admin = require('../models/adminModel');
const Menu = require('../models/menuModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

const adminController = {
  getDashboardStats: async (req, res) => {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Total menus
      const totalMenus = await Menu.countDocuments();

      // New menus today
      const newMenusToday = await Menu.countDocuments({ createdAt: { $gte: todayStart } });

      // Total users
      const totalUsers = await User.countDocuments();

      // Active users in last 7 days (assuming User has 'lastLogin' field)
      const activeUsers = await User.countDocuments({ lastLogin: { $gte: weekAgo } });

      // Latest activity: combine last 5 menu changes + last 5 user registrations, sort by date desc
      // For simplicity, fetching separately then merge:
      const recentMenusAdded = await Menu.find({}, 'name createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      const recentUsersRegistered = await User.find({}, 'name createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      // Build unified latestActivity array
      const latestActivity = [];

      recentMenusAdded.forEach(menu => {
        latestActivity.push({
          id: menu._id.toString(),
          type: 'menu_added',
          description: `${menu.name} ditambahkan`,
          date: menu.createdAt,
        });
      });

      recentUsersRegistered.forEach(user => {
        latestActivity.push({
          id: user._id.toString(),
          type: 'user_registered',
          description: `Pengguna baru terdaftar: ${user.name}`,
          date: user.createdAt,
        });
      });

      // Sort by date desc and take top 5
      latestActivity.sort((a, b) => b.date - a.date);
      const latestActivityTop5 = latestActivity.slice(0, 5);

      // Format dates to ISO string or other desired format
      const latestActivityFormatted = latestActivityTop5.map(item => ({
        ...item,
        date: item.date.toISOString().split('T')[0], // 'YYYY-MM-DD'
      }));

      res.status(200).json({
        totalMenus,
        newMenusToday,
        totalUsers,
        activeUsers,
        latestActivity: latestActivityFormatted,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
    }
  },

  // Get admin profile
  getAdminProfile: async (req, res) => {
    try {
      // In a real app, adminId would come from authenticated session (req.user.id)
      const admin = await Admin.findById(req.params.adminId);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      // Exclude password for security
      const { password, ...adminWithoutPassword } = admin._doc;
      res.status(200).json(adminWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching admin profile', error: error.message });
    }
  },

  // Update admin profile
  updateAdminProfile: async (req, res) => {
    try {
      // In a real app, adminId would come from authenticated session (req.user.id)
      const updatedAdmin = await Admin.findByIdAndUpdate(req.params.adminId, req.body, { new: true, runValidators: true });
      if (!updatedAdmin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      const { password, ...adminWithoutPassword } = updatedAdmin._doc;
      res.status(200).json({ message: 'Admin profile updated successfully', admin: adminWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: 'Error updating admin profile', error: error.message });
    }
  },
};

module.exports = adminController;