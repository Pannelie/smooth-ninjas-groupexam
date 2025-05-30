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
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    //enum betyder att det är endast dessa värden som är tillåtna, inget annat
    enum: ["guest", "admin"],
    default: "guest",
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
