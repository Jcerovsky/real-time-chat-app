import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("connected to MongoDB via Mongoose");
  })
  .catch((error) => console.log("Connection error:", error));
