// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

// Import models
const Menu = require('./models/menuModel');
const User = require('./models/userModel');
const Admin = require('./models/adminModel');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/madangae';

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected for seeding.');

    // Clear existing data (optional, for fresh start)
    await Menu.deleteMany({});
    await User.deleteMany({});
    await Admin.deleteMany({});

    console.log('Database cleared.');

    // Create a sample admin user
    const adminPassword = await bcrypt.hash('admin123', 10); // Hash password
    const adminUser = await Admin.create({
      name: 'Super Admin',
      email: 'admin@madangae.com',
      password: adminPassword,
      role: 'Super Admin',
    });
    console.log('Admin user created:', adminUser.email);

    // Create a sample regular user
    const userPassword = await bcrypt.hash('user123', 10); // Hash password
    // In the regular user creation part, add username:
    const regularUser = await User.create({
      username: 'johndoe', // Add this line
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: userPassword,
      bio: 'Food enthusiast and home cook.',
      profilePicture: 'https://placehold.co/100x100/FFD700/000000?text=JD',
      createdAt: new Date(),
      lastLogin: new Date(),
    });
    console.log('Regular user created:', regularUser.email);

    // Create sample menus
    const menus = await Menu.insertMany([
      {
        name: 'Nasi Goreng Spesial',
        category: 'Indonesian',
        imageUrl: 'https://i.pinimg.com/736x/d3/68/1b/d3681b77fd24ef9cd92886272c0dfe6a.jpg',
        description: 'Nasi goreng dengan bumbu spesial dan topping lengkap.',
        ingredients: ['2 piring nasi putih', '100 gr ayam suwir', '2 butir telur', 'Bumbu halus: bawang merah, bawang putih, cabai', 'Kecap manis, garam, merica'],
        tutorial: ['Tumis bumbu halus.', 'Masukkan telur, orak-arik.', 'Masukkan ayam suwir dan nasi, aduk rata.', 'Tambahkan kecap, garam, merica. Aduk hingga matang.', 'Sajikan dengan acar dan kerupuk.'],
        rating: 4.8
      },
      {
        name: 'Sate Ayam Madura',
        category: 'Indonesian',
        imageUrl: 'https://i.pinimg.com/736x/2a/7c/b5/2a7cb5982f8ac749ddb9387fee9c163e.jpg',
        description: 'Sate ayam khas Madura dengan bumbu kacang yang kaya rasa.',
        ingredients: ['500 gr dada ayam', 'Bumbu kacang: kacang tanah, bawang putih, cabai, gula merah', 'Kecap manis', 'Jeruk limau'],
        tutorial: ['Potong ayam dadu, tusuk.', 'Bakar sate hingga matang.', 'Siram dengan bumbu kacang.', 'Sajikan dengan lontong.'],
        rating: 4.5
      },
      {
        name: 'Gado-Gado',
        category: 'Vegetarian',
        imageUrl: 'https://i.pinimg.com/736x/e9/49/9c/e9499c5a75dc8f7de55f33d38e25d57c.jpg',
        description: 'Salad sayuran khas Indonesia dengan saus kacang.',
        ingredients: ['Sayuran rebus (kangkung, tauge, kol)', 'Kentang rebus', 'Tahu, tempe goreng', 'Telur rebus', 'Bumbu kacang'],
        tutorial: ['Tata sayuran dan bahan lain di piring.', 'Siram dengan bumbu kacang.', 'Taburi bawang goreng.', 'Sajikan.'],
        rating: 4.2
      },
      {
        name: 'Rendang Daging',
        category: 'Indonesian',
        imageUrl: 'https://i.pinimg.com/736x/d0/aa/52/d0aa521546872cba34257b91c71589f7.jpg',
        description: 'Daging sapi yang dimasak perlahan dengan santan dan rempah.',
        ingredients: ['1 kg daging sapi', '1 liter santan kental', 'Bumbu halus: bawang merah, bawang putih, cabai, jahe, lengkuas, kunyit', 'Daun jeruk, daun kunyit, serai, asam kandis'],
        tutorial: ['Tumis bumbu halus hingga harum.', 'Masukkan daging, aduk hingga berubah warna.', 'Tuang santan, masukkan daun-daunan.', 'Masak hingga santan mengering dan bumbu meresap.', 'Aduk sesekali agar tidak gosong.', 'Masak hingga daging empuk dan bumbu mengental.'],
        rating: 4.9
      },
      {
        name: 'Soto Ayam',
        category: 'Indonesian',
        imageUrl: 'https://i.pinimg.com/736x/5e/80/92/5e809279b9765d8baa69323f86d1205a.jpg',
        description: 'Soto ayam khas Indonesia dengan kuah kuning yang gurih.',
        ingredients: ['Ayam, bihun, tauge, telur rebus', 'Bumbu soto: bawang merah, bawang putih, jahe, kunyit, kemiri', 'Daun jeruk, serai, daun salam'],
        tutorial: ['Rebus ayam hingga matang, suwir.', 'Tumis bumbu soto hingga harum.', 'Masukkan bumbu ke kaldu ayam.', 'Sajikan dengan pelengkap.'],
        rating: 4.6
      },
      {
        name: 'Rawon',
        category: 'Indonesian',
        imageUrl: 'https://i.pinimg.com/736x/94/3a/25/943a25701803947e8853083430d01c39.jpg',
        description: 'Sup daging hitam khas Jawa Timur dengan kluwek.',
        ingredients: ['Daging sapi', 'Kluwek, bawang merah, bawang putih, cabai', 'Daun jeruk, serai, lengkuas'],
        tutorial: ['Rebus daging hingga empuk.', 'Haluskan bumbu, tumis.', 'Masukkan bumbu ke kaldu daging.', 'Masak hingga mendidih.', 'Sajikan dengan tauge pendek dan telur asin.'],
        rating: 4.7
      },
      {
        name: 'Capcay Kuah',
        category: 'Chinese',
        imageUrl: 'https://i.pinimg.com/736x/d4/01/c8/d401c8c57cc3ea2800b81b921492b47c.jpg',
        description: 'Tumis sayuran dengan kuah kental ala Chinese.',
        ingredients: ['Aneka sayuran (wortel, brokoli, kembang kol, sawi)', 'Ayam, udang', 'Bawang putih, saus tiram, kecap ikan', 'Tepung maizena'],
        tutorial: ['Tumis bawang putih.', 'Masukkan ayam dan udang.', 'Tambahkan sayuran.', 'Tuang air, bumbui.', 'Kentalkan dengan maizena.'],
        rating: 4.3
      },
      {
        name: 'Spaghetti Carbonara',
        category: 'Italian',
        imageUrl: 'https://i.pinimg.com/736x/0d/17/7f/0d177f6cb549a70418c50a18fdc0a06f.jpg',
        description: 'Pasta creamy dengan telur, keju, dan daging asap.',
        ingredients: ['Spaghetti', 'Telur, keju parmesan, keju pecorino', 'Smoked beef/bacon', 'Bawang putih, lada hitam'],
        tutorial: ['Rebus spaghetti.', 'Tumis smoked beef.', 'Campur telur, keju, lada.', 'Masukkan spaghetti ke wajan, aduk dengan saus telur.', 'Sajikan.'],
        rating: 4.4
      },
    ]);
    console.log('Menus seeded successfully.');

    // Add some menus to the regular user's collection
    const nasiGoreng = await Menu.findOne({ name: 'Nasi Goreng Spesial' });
    const ayamBakar = await Menu.findOne({ name: 'Sate Ayam Madura' });

    if (nasiGoreng && ayamBakar) {
      regularUser.collections.push({
        name: 'Resep Favoritku',
        menus: [nasiGoreng._id, ayamBakar._id]
      });
      regularUser.collections.push({
        name: 'Menu Cepat Sahur',
        menus: [nasiGoreng._id]
      });
      await regularUser.save();
      console.log('User collections updated.');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect(); // Disconnect after seeding
  }
};

seedDatabase();