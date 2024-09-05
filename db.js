const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URL environment variable is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully..");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
