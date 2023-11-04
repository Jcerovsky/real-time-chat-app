import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
});

let User: any;

if (mongoose.models.User) {
  User = mongoose.model("User");
} else {
  User = mongoose.model("User", userSchema);
}

export default User;
