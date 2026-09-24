const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Product = require('../models/Product');

const dummyProducts = [
  {
    name: "Minimalist Leather Watch",
    description: "Classic analog watch featuring a genuine leather strap and water resistance.",
    price: 129.50,
    category: "accessories",
    stock: 25,
    rating: 4.8,
    numReviews: 24,
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Ergonomic Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with tactile switches for typing and gaming.",
    price: 89.99,
    category: "electronics",
    stock: 40,
    rating: 4.6,
    numReviews: 18,
    image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Smart Fitness Watch",
    description: "Track your workouts, heart rate, and sleep quality with all-day battery life.",
    price: 149.99,
    category: "electronics",
    stock: 15,
    rating: 4.7,
    numReviews: 30,
    image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Wireless Headphones",
    description: "High-fidelity audio with active noise cancellation and 30-hour battery life.",
    price: 199.99,
    category: "electronics",
    stock: 30,
    rating: 4.9,
    numReviews: 42,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Modern Wireless Mouse",
    description: "Sleek ergonomic design with high precision tracking and fast recharge.",
    price: 49.99,
    category: "electronics",
    stock: 50,
    rating: 4.4,
    numReviews: 15,
    image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Classic Sunglasses",
    description: "Polarized lenses with UV400 protection and lightweight durable frame.",
    price: 35.00,
    category: "accessories",
    stock: 35,
    rating: 4.5,
    numReviews: 9,
    image_url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80"
  }
];

// Assign every possible image key name so the frontend gets it regardless of its schema preference
dummyProducts.forEach(p => {
  p.image = p.image_url;
  p.imageUrl = p.image_url;
  p.images = [p.image_url];
});

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shophub';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);

    const deleteResult = await Product.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} old products.`);

    const inserted = await Product.insertMany(dummyProducts);
    console.log(`Successfully inserted ${inserted.length} fresh products!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();