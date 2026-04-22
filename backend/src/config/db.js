const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Keep the server running so it can return clear API errors (and to allow
    // the DB to be fixed/restarted without killing the process).
    return false;
  }
  return true;
};

module.exports = connectDB;
