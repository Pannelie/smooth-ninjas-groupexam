import User from "../models/user";
import { generateUserId } from "../utils/utils.js";

export async function createUser(username, password) {
  const existingUser = await User.find({ username });
  if (existingUser) {
    throw new error("Username already taken");
  }
  const user = new User.create({
    username,
    password,
  });
}
