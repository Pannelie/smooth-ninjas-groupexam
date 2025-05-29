import User from "../models/user";

export async function createUser(username, password) {
  const existingUser = await User.find({ username });
  if (existingUser) {
    throw new error("Username already taken");
  }
}
