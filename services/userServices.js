import User from "../models/user.js";

export async function createUser(user) {
  try {
    const result = await User.create(user);
    return result;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export async function getUser(username) {
  try {
    const result = await User.findOne({ username: username });
    if (result) return result;
    else throw new Error(`No user found`);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
