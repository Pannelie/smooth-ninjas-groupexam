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

export async function getUser(username) {
  try {
    const user = await User.findOne({ username: username });
    if (user) return user;
    else throw new Error(`No user found`);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
