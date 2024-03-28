import express from "express";
import { createMessage, getMessages } from "../controllers/message.controller";

const messageRoutes = express.Router();

messageRoutes.post("/", createMessage);
messageRoutes.get("/:chatId", getMessages);

export default messageRoutes;
