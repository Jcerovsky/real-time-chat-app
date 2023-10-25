import connectDb from "@/app/lib/mongoose";
import Message from "@/app/models/Message";
import { NextResponse } from "next/server";

const handler = async () => {
  try {
    await connectDb();
  } catch (err) {
    return NextResponse.json({ status: 500 });
  }

  const newMessage = new Message({
    fromUserID: from,
    toUserID: to,
    content: content,
  });
  try {
    await newMessage.save();
  } catch (err) {
    console.log("Could not save message to database:", err);
  }
};
