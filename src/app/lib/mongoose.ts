import mongoose, { mongo } from "mongoose";

const connectDb = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to database");
  } catch (error) {
    console.log("Could not connect to database:", error);
  }
};

export default connectDb;
