import { Request, Response } from "express";
import userModel from "../models/users.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const createToken = (_id: string) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user)
      return res
        .status(400)
        .send("User with the given email already exists...");

    if (!name || !email || !password)
      return res.status(400).send("All fields are required...");

    if (!validator.isEmail(email))
      return res.status(400).send("Email must be a valid email...");

    if (!validator.isStrongPassword(password))
      return res.status(400).send("Password must be a strong password...");

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = createToken(user._id.toString());

    res
      .status(200)
      .json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (error) {
    console.log("🚀 ~ registerUser ~ error:", error);
    res.status(500).json(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).send("Invalid email or password...");

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(400).send("Invalid email or password...");

    const token = createToken(user._id.toString());

    res
      .status(200)
      .json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (error) {
    console.log("🚀 ~ loginUser ~ error:", error);
    res.status(500).json(error);
  }
};

export const findUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.log("🚀 ~ findUser ~ error:", error);
    res.status(500).json(error);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const user = await userModel.find();

    res.status(200).json(user);
  } catch (error) {
    console.log("🚀 ~ findUser ~ error:", error);
    res.status(500).json(error);
  }
};
