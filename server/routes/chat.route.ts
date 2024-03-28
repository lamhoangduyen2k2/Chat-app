import express from "express";
import { createChat, findChat, findUserChats } from "../controllers/chat.controller";

const chatRoutes = express.Router();

chatRoutes.post("/", createChat);
chatRoutes.get("/:userId", findUserChats);
chatRoutes.get("/find/:firstId/:secondId", findChat);

export default chatRoutes;