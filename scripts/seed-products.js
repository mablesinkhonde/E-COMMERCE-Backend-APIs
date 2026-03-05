const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shophub';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  stock: Number,
  rating: Number,
  reviews: Number,
});

const Product = mongoose.model('Product', productSchema);

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 129.99,
    image: 'https://via.placeholder.com/300x300?text=Wireless+Headphones',
    category: 'Electronics',
    stock: 50,
    rating: 4.5,
    reviews: 234,
  },
  {
    name: 'Smartwatch Pro',
    description: 'Advanced smartwatch with fitness tracking and notifications',
    price: 299.99,
    image: 'https://via.placeholder.com/300x300?text=Smartwatch+Pro',
    category: 'Electronics',
    stock: 30,
    rating: 4.8,
    reviews: 456,
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors',
    price: 29.99,
    image: 'https://via.placeholder.com/300x300?text=Cotton+T-Shirt',
    category: 'Clothing',
    stock: 100,
    rating: 4.2,
    reviews: 145,
  },
  {
    name: 'Blue Jeans',
    description: 'Classic blue denim jeans with comfortable fit',
    price: 59.99,
    image: 'https://via.placeholder.com/300x300?text=Blue+Jeans',
    category: 'Clothing',
    stock: 80,
    rating: 4.3,
    reviews: 189,
  },
  {
    name: 'Programming Guide',
    description: 'Complete guide to web development and JavaScript',
    price: 39.99,
    image: 'https://via.placeholder.com/300x300?text=Programming+Guide',
    category: 'Books',
    stock: 45,
    rating: 4.7,
    reviews: 321,
  },
  {
    name: 'Database Design Book',
    description: 'Learn database design principles and best practices',
    price: 49.99,
    image: 'https://via.placeholder.com/300x300?text=Database+Design',
    category: 'Books',
    stock: 35,
    rating: 4.6,
    reviews: 267,
  },
  {
    name: 'Coffee Maker',
    description: 'Automatic coffee maker with programmable settings',
    price: 89.99,
    image: 'https://via.placeholder.com/300x300?text=Coffee+Maker',
    category: 'Home',
    stock: 25,
    rating: 4.4,
    reviews: 198,
  },
  {
    name: 'Kitchen Blender',
    description: 'Powerful blender for smoothies and soups',
    price: 79.99,
    image: 'https://via.placeholder.com/300x300?text=Kitchen+Blender',
    category: 'Home',
    stock: 20,
    rating: 4.5,
    reviews: 156,
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for all types of exercises',
    price: 34.99,
    image: 'https://via.placeholder.com/300x300?text=Yoga+Mat',
    category: 'Sports',
    stock: 60,
    rating: 4.3,
    reviews: 223,
  },
  {
    name: 'Basketball',
    description: 'Official size basketball for indoor and outdoor play',
    price: 44.99,
    image: 'https://via.placeholder.com/300x300?text=Basketball',
    category: 'Sports',
    stock: 40,
    rating: 4.6,
    reviews: 178,
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable and durable running shoes with cushioning',
    price: 119.99,
    image: 'https://via.placeholder.com/300x300?text=Running+Shoes',
    category: 'Sports',
    stock: 55,
    rating: 4.7,
    reviews: 445,
  },
  {
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness',
    price: 54.99,
    image: 'https://via.placeholder.com/300x300?text=Desk+Lamp',
    category: 'Home',
    stock: 38,
    rating: 4.4,
    reviews: 132,
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const result = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${result.length} products`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedProducts();
