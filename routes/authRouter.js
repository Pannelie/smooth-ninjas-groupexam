import express from "express";
import { createUser, getUser } from "../services/userServices.js";
import { generateUserId } from "../utils/utils.js";

const router = express.Router();

//registrera användare
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    const user = await createUser({
      username,
      password,
      userId: generateUserId(),
    });
    if (user) {
      res.status(201).json({ success: true, message: `User created successfully` });
    } else {
      next({
        status: 400,
        message: `Registrering was not successful`,
      });
    }
  } else {
    next({
      status: 400,
      message: `Username and password are required`,
    });
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
