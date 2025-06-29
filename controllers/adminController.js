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
        success: true,
        data: {
          totalMenus,
          newMenusToday,
          totalUsers,
          activeUsers,
          latestActivity: latestActivityFormatted,
        }
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching dashboard stats',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  getAdminProfile: async (req, res) => {
    try {
      // Get adminId from authenticated user (req.user.id from auth middleware)
      const adminId = req.user.id;
      const admin = await Admin.findById(adminId);
      
      if (!admin) {
        return res.status(404).json({ 
          success: false,
          message: 'Admin not found' 
        });
      }

      // Exclude sensitive data
      const { password, __v, ...adminData } = admin._doc;
      
      res.status(200).json({
        success: true,
        data: adminData
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching admin profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  updateAdminProfile: async (req, res) => {
    try {
      const adminId = req.user.id;
      const updates = req.body;

      // Prevent role change unless by super admin
      if (updates.role && req.user.role !== 'Super Admin') {
        delete updates.role;
      }

      // Prevent password update via this endpoint
      if (updates.password) {
        return res.status(400).json({
          success: false,
          message: 'Use the change password endpoint to update password'
        });
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(
        adminId,
        updates,
        { 
          new: true,
          runValidators: true,
          select: '-password -__v' // Exclude sensitive fields
        }
      );

      if (!updatedAdmin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedAdmin
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating admin profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = adminController;