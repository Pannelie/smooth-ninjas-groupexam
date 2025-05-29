import User from "../models/user.js";
import { generateUserId } from "../utils/utils.js";

export async function createUser(username, password) {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username already taken");
  }
  const user = await User.create({
    username,
    password,
    userId: generateUserId(),
  });
  return { username: user.username, userId: user.userId };
}
