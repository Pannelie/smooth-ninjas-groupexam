import express from "express";
import { createUser, getUser } from "../services/userServices.js";
import { generateUserId } from "../utils/utils.js";

const router = express.Router();

//logout
router.get("/logout", (req, res, next) => {
  if (global.user) {
    const loggedOutUser = global.user.username;
    global.user = null;
    res.json({
      success: true,
      message: `Successfully logged out ${loggedOutUser}`,
    });
  } else {
    next({ status: 400, message: "No user logged in" });
  }
});

//register user
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
        message: `Registration was not successful`,
      });
    }
  } else {
    next({
      status: 400,
      message: `Username and password are required`,
    });
  }
});

//login user
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
