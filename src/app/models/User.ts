import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

let User: any;

if (mongoose.models.User) {
  User = mongoose.model("User");
} else {
  User = mongoose.model("User", userSchema);
}

export default User;
