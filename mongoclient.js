require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB connection
const mongoUri = process.env.mongoUri;
const client = new MongoClient(mongoUri);


async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client;
    
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw error;
  }
}

module.exports= connectDB;