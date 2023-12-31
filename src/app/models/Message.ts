import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    ref: "User",
    required: true,
  },
  to: {
    type: String,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

let Message: any;

if (mongoose.models.Message) {
  Message = mongoose.model("Message");
} else {
  Message = mongoose.model("Message", messageSchema);
}

export default Message;
