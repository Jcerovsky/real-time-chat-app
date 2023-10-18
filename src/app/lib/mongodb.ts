import { MongoClient } from "mongodb";

export const connectDb = async () => {
  const client = new MongoClient(process.env.MONGODB_URI!);
  try {
    await client.connect();
    return client;
  } catch (error) {
    console.error(error);
  }
};
