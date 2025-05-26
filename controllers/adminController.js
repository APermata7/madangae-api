// controllers/adminController.js
const Admin = require('../models/adminModel');
const Menu = require('../models/menuModel'); // Required for dashboard stats
const User = require('../models/userModel'); // Required for dashboard stats

const adminController = {
  // Get dashboard stats
  getDashboardStats: async (req, res) => {
    try {
      const totalMenus = await Menu.countDocuments();
      const totalUsers = await User.countDocuments();
      // For simplicity, new menus today and active users are mock data
      const newMenusToday = Math.floor(Math.random() * 5); // Simulate 0-4 new menus
      const activeUsers = Math.floor(Math.random() * 2000) + 1000; // Simulate 1000-3000 active users

      const latestActivity = [
        { id: 'a1', type: 'menu_added', description: 'Nasi Goreng Seafood ditambahkan', date: '2025-05-24' },
        { id: 'a2', type: 'menu_edited', description: 'Resep Rendang Daging diperbarui', date: '2025-05-23' },
        { id: 'a3', type: 'user_registered', description: 'Pengguna baru terdaftar', date: '2025-05-22' },
      ];

      res.status(200).json({
        totalMenus,
        newMenusToday,
        totalUsers,
        activeUsers,
        latestActivity
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