import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  fromUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUserID: {
    type: mongoose.Schema.Types.ObjectId,
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
