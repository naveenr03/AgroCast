import express from "express";
import { UserModel } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, location } = req.body;
  const user = await UserModel.findOne({ username });

  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with username, password, and location
  const newUser = new UserModel({ username, password: hashedPassword, location });
  await newUser.save();

  // Return the userID, username, and location
  res.json({
    message: "User registered successfully",
    userID: newUser._id,  // Send back userID to use in the frontend
    username: newUser.username,
    location: newUser.location,
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Create a JWT token for the user
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  // Return user details along with token (no location here)
  res.json({
    token,
    userID: user._id,
    username: user.username,
    location: user.location,
  });
});

export { router as userRouter };
