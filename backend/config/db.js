const mongoose = require("mongoose");
const config = require("../utils/config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI, {
      dbName: "cm3-group8",
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
