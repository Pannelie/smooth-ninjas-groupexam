import express from "express";
import { createUser, getUser } from "../services/userServices.js";
import User from "../models/user.js";

const router = express.Router();

//registrera användare
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const newUser = await createUser(username, password);
    res.status(201).json({ success: true, message: "user created successfully", user: newUser });
  } catch (error) {
    next(error);
    // res.status(400).json({ success: false, error: error.message });
  }
});

//logga in användare
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    const user = await getUser(username);
    if (user) {
      if (user.password === password) {
        global.user = user;
        res.status(200).json({ success: true, message: `Logged in successfully` });
      } else {
        next({ status: 400, message: `Wrong username or password` });
      }
    } else {
      next({ status: 400, message: `No user found` });
    }
  } else {
    next({
      status: 400,
      message: `Username and password are required`,
    });
  }
});

export default router;
