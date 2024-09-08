import express from "express";
import { UserModel } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ username, password : hashedPassword });
  await newUser.save();
  res.json({ message: "User registered successfully" });
});

router.post("/login", async (req,res) => {

  const {username, password} = req.body;

  const user = await UserModel.findOne({ username });

  if(!user){
    return res.status(400).json({ message: "User does not exist" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if(!isPasswordValid){
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign( { id: user._id }, process.env.JWT_SECRET);

  res.json({ token , userID : user._id });


})

export { router as userRouter };
