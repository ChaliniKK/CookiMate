const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We use process.env.MONGO_URI to pull the secret link from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // If the database fails to connect, we want the whole server to stop (exit 1)
    process.exit(1);
  }
};

module.exports = connectDB;