import express from "express";
import { findUser, getUsers, loginUser, registerUser } from "../controllers/user.controller";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/find/:userId", findUser);
userRoutes.get("/", getUsers);

export default userRoutes;
