// controllers/menuController.js
const Menu = require('../models/menuModel');
const User = require('../models/userModel'); // Needed for deletion cascade

const menuController = {
  // Get all menus (for user 'Menu' page and admin 'Menu Management')
  getAllMenus: async (req, res) => {
    try {
      const menus = await Menu.find({});
      res.status(200).json(menus);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching menus', error: error.message });
    }
  },

  // Get a single menu by ID
  getMenuById: async (req, res) => {
    try {
      const menu = await Menu.findById(req.params.id);
      if (!menu) {
        return res.status(404).json({ message: 'Menu not found' });
      }
      res.status(200).json(menu);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching menu', error: error.message });
    }
  },

  // Get recommended/latest menus (for user 'Home' page)
  getRecommendedMenus: async (req, res) => {
    try {
      // For simplicity, return the latest 4 menus by creation date, sorted by rating (desc)
      const recommended = await Menu.find({}).sort({ createdAt: -1, rating: -1 }).limit(4);
      res.status(200).json(recommended);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching recommended menus', error: error.message });
    }
  },

  // Search menus by name or category (for user 'Search' page)
  searchMenus: async (req, res) => {
    const { query, category } = req.query;
    let filter = {};

    if (query) {
      filter.name = { $regex: query, $options: 'i' }; // Case-insensitive search
    }
    if (category) {
      filter.category = { $regex: category, $options: 'i' }; // Case-insensitive search
    }

    try {
      const menus = await Menu.find(filter);
      res.status(200).json(menus);
    } catch (error) {
      res.status(500).json({ message: 'Error searching menus', error: error.message });
    }
  },

  // Admin: Add a new menu
  addMenu: async (req, res) => {
    try {
      const newMenu = new Menu(req.body);
      await newMenu.save();
      res.status(201).json({ message: 'Menu added successfully', menu: newMenu });
    } catch (error) {
      res.status(400).json({ message: 'Error adding menu', error: error.message });
    }
  },

  // Admin: Update an existing menu
  updateMenu: async (req, res) => {
    try {
      const updatedMenu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedMenu) {
        return res.status(404).json({ message: 'Menu not found' });
      }
      res.status(200).json({ message: 'Menu updated successfully', menu: updatedMenu });
    } catch (error) {
      res.status(400).json({ message: 'Error updating menu', error: error.message });
    }
  },

  // Admin: Delete a menu
  deleteMenu: async (req, res) => {
    try {
      const deletedMenu = await Menu.findByIdAndDelete(req.params.id);
      if (!deletedMenu) {
        return res.status(404).json({ message: 'Menu not found' });
      }
      // Also remove this menu from any user collections that reference it
      // Note: This is an efficient way to pull from all collections in all users
      await User.updateMany(
        { 'collections.menus': deletedMenu._id },
        { $pull: { 'collections.$.menus': deletedMenu._id } }
      );
      res.status(200).json({ message: 'Menu deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting menu', error: error.message });
    }
  },
};

module.exports = menuController;