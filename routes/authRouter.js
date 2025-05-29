import express from "express";
import { createUser } from "../services/userServices.js";

const router = express.Router();

//registrera användare
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await createUser(username, password);
    res.status(201).json({ success: true, message: "user created successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
