import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["guest", "user", "admin"],
    default: "user",
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
