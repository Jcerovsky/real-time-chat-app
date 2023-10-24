import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user1ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user2ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
});

const DirectChat = mongoose.model("Chat", chatSchema, "Chats");
export default DirecChat;
