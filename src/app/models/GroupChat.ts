import mongoose from "mongoose";

const groupChatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  createdAt: { type: Date, default: Date.now },
  // ... any other properties you need ...
});

const GroupChat = mongoose.model("GroupChat", groupChatSchema);

export default GroupChat;
