import mongoose from "mongoose";

const conn = async () => {
  try {
    const mongodbURI = process.env.MONGODB_URI;
    await mongoose.connect(mongodbURI);
    console.log("connected to database");
  } catch (error) {
    console.log(`line no 9 db.js: ${error}`);
  }
};

export default conn;
