// controllers/userController.js
const User = require('../models/userModel');
const Menu = require('../models/menuModel'); // Ensure Menu model is available for population
const Collection = require('../models/Collection'); // Assuming your Collection model path
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For JWT tokens

const userController = {
  // Add signup and login methods directly into the userController object
  signup: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // 1. Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // 2. Hash password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is salt rounds

      // 3. Create new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword
      });
      await newUser.save();

      // 4. Generate JWT token
      const token = jwt.sign(
        { userId: newUser._id, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      // 5. Send success response
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email
        },
        token
      });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Internal server error during signup' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // 2. Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // 3. Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // 4. Send success response
      res.status(200).json({
        message: 'Logged in successfully',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email
        },
        token
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error during login' });
    }
  },

  // Get user profile
  getUserProfile: async (req, res) => {
    try {
      // Ensure you populate the nested 'menus' array within 'collections'
      const user = await User.findById(req.params.userId) //update dari id -> userId
        .populate({
          path: 'collections.menus', // Path to the 'menus' array inside each collection
          model: 'Menu'             // The model to use for population
        })
        .select('-password'); // Exclude password from the response

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile with collections:', error);
      res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
  },

  // Update user profile
  updateUserProfile: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      const { password, ...userWithoutPassword } = updatedUser._doc;
      res.status(200).json({ message: 'Profile updated successfully', user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: 'Error updating profile', error: error.message });
    }
  },

  /// Get user collections
  getUserCollections: async (req, res) => {
  try {
    console.log('=== getUserCollections Clean ===');
    console.log('UserID:', req.params.userId);
    
    // Get user WITHOUT populate first
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found, collections count:', user.collections.length);
    
    const allMenuItems = [];
    
    for (let collection of user.collections) {
      console.log(`Processing collection:`, {
        collectionId: collection._id,
        name: collection.name,
        menusCount: collection.menus.length
      });
      
      // Manual fetch each menu by ID
      for (let menuId of collection.menus) {
        console.log(`Fetching menu:`, menuId);
        
        try {
          const menu = await Menu.findById(menuId);
          
          if (!menu) {
            console.log(`Menu ${menuId} not found, skipping`);
            continue;
          }
          
          console.log(`Menu found:`, {
            name: menu.name,
            category: menu.category,
            hasImage: !!menu.imageUrl,
            hasDescription: !!menu.description
          });
          
          // Transform menu data - NO PRICE
          const transformedItem = {
            _id: menu._id,
            menuItemId: menu._id,
            menuItemName: menu.name || 'Unknown Item',
            menuItemDescription: menu.description || 'No description available.',
            menuItemCategory: menu.category || 'N/A',
            menuItemImage: menu.imageUrl || '',
            rating: Number(menu.rating) || 0,
            ingredients: menu.ingredients || [],
            tutorial: menu.tutorial || []
          };
          
          console.log(`Transformed:`, {
            name: transformedItem.menuItemName,
            category: transformedItem.menuItemCategory,
            hasImage: !!transformedItem.menuItemImage,
            ingredientsCount: transformedItem.ingredients.length,
            tutorialSteps: transformedItem.tutorial.length
          });
          
          allMenuItems.push(transformedItem);
          
        } catch (menuError) {
          console.error(`Error fetching menu ${menuId}:`, menuError);
        }
      }
    }
    
    console.log('Final result:', {
      totalItems: allMenuItems.length,
      itemsWithNames: allMenuItems.filter(item => item.menuItemName !== 'Unknown Item').length
    });
    console.log('=== End Clean Collections ===');
    
    res.status(200).json({
      collections: allMenuItems
    });
    
  } catch (error) {
    console.error('Error in getUserCollections:', error);
    res.status(500).json({ 
      message: 'Error fetching collections', 
      error: error.message 
    });
  }
},

  // Create a new collection (and handle adding to "My Favorites" if menuItemId is provided)
  createCollection: async (req, res) => {
    const { name, menuItemId } = req.body; // `name` for new collection, `menuItemId` for adding to default
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If a name is provided, create a new named collection
      if (name) {
        const newCollection = { name, menus: menuItemId ? [menuItemId] : [] }; // <-- Corrected: menus
        user.collections.push(newCollection);
        await user.save();
        // Return the newly added collection or just a success message
        return res.status(201).json({ message: 'Collection created successfully', newCollection: user.collections[user.collections.length - 1] });
      }

      // If menuItemId is provided without a name, add to "My Favorites" or default collection
      if (menuItemId) {
        let defaultCollection = user.collections.find(col => col.name === "My Favorites");

        if (!defaultCollection) {
          // If "My Favorites" doesn't exist, create it
          defaultCollection = { name: "My Favorites", menus: [] }; // <-- Corrected: menus
          user.collections.push(defaultCollection);
          // Find the newly added collection to push the item
          defaultCollection = user.collections[user.collections.length - 1];
        }

        // Ensure the 'menus' array exists, initialize if not (though Mongoose usually handles this)
        defaultCollection.menus = defaultCollection.menus || []; // <-- Corrected: menus

        // Check if menu already exists in the collection
        if (!defaultCollection.menus.includes(menuItemId)) { // <-- Corrected: menus
          defaultCollection.menus.push(menuItemId); // <-- Corrected: menus
          await user.save();
          return res.status(200).json({ message: 'Menu item added to "My Favorites" collection' });
        } else {
          return res.status(409).json({ message: 'Menu item already in "My Favorites" collection' });
        }
      }

      return res.status(400).json({ message: 'Invalid request: Must provide name for new collection or menuItemId to add to default.' });

    } catch (error) {
      console.error('Error in createCollection:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },


  // Add menu to a specific collection (via collectionId)
  addMenuToCollection: async (req, res) => {
    const { menuId } = req.body;
    const { userId, collectionId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const collection = user.collections.id(collectionId);
      if (!collection) {
        return res.status(404).json({ message: 'Collection not found' });
      }

      // Check if menu already exists in collection
      if (collection.menus.includes(menuId)) { // <--- CHANGE THIS LINE from 'menuItems' to 'menus'
        return res.status(409).json({ message: 'Menu already in this collection' });
      }

      collection.menus.push(menuId); // <--- CHANGE THIS LINE from 'menuItems' to 'menus'
      await user.save();
      res.status(200).json({ message: 'Menu added to collection successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error adding menu to collection', error: error.message });
    }
  },

  // Remove menu from a specific collection (via collectionId)
  removeMenuFromCollection: async (req, res) => {
    const { userId, collectionId, menuId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const collection = user.collections.id(collectionId);
      if (!collection) {
        return res.status(404).json({ message: 'Collection not found' });
      }

      // Ensure menuId is in the array before pulling
      if (!collection.menus.includes(menuId)) { // <--- CHANGE THIS LINE from 'menuItems' to 'menus'
          return res.status(404).json({ message: 'Menu item not found in this collection' });
      }

      collection.menus.pull(menuId); // <--- CHANGE THIS LINE from 'menuItems' to 'menus'
      await user.save();
      res.status(200).json({ message: 'Menu removed from collection successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing menu from collection', error: error.message });
    }
  },

// update: Remove menu item from any collection (simple removal)
removeMenuItemSimple: async (req, res) => {
  const { userId, menuItemId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let menuFound = false;
    let collectionName = '';

    // Find and remove the menu item from any collection
    user.collections.forEach(collection => {
      const menuIndex = collection.menus.indexOf(menuItemId);
      if (menuIndex > -1) {
        collection.menus.splice(menuIndex, 1);
        menuFound = true;
        collectionName = collection.name || 'My Favorites';
      }
    });

    if (!menuFound) {
      return res.status(404).json({ message: 'Menu item not found in any collection' });
    }

    await user.save();
    res.status(200).json({ 
      message: `Menu removed from "${collectionName}" collection successfully` 
    });
  } catch (error) {
    console.error('Error removing menu item:', error);
    res.status(500).json({ message: 'Error removing menu item', error: error.message });
  }
},

  // Delete a collection
  deleteCollection: async (req, res) => {
    const { userId, collectionId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the collection exists before attempting to remove
      // The .id() method is fine for finding it, but .remove() on it is the issue.
      const collectionToDelete = user.collections.id(collectionId);
      if (!collectionToDelete) { // Check if it was actually found
        return res.status(404).json({ message: 'Collection not found' });
      }

      // --- CRITICAL FIX: Use .pull() on the array to remove the subdocument by its _id ---
      user.collections.pull(collectionId); // This removes the subdocument with the given _id
      await user.save(); // Save the parent document after modification
      res.status(200).json({ message: 'Collection deleted successfully' });
    } catch (error) {
      console.error('Error deleting collection:', error); // Keep logging the full error for future debugging
      res.status(500).json({ message: 'Error deleting collection', error: error.message });
    }
  },
};

module.exports = userController;