import { Request, Response } from "express";
import chatModel from "../models/chat.model";

export const createChat = async (req: Request, res: Response) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) return res.status(200).json(chat);

    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();

    res.status(201).json(response);
  } catch (error) {
    console.log("🚀 ~ createChat ~ error:", error);
    res.status(500).json(error);
  }
};

export const findUserChats = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({ members: { $in: [userId] } });

    res.status(200).json(chats);
  } catch (error) {
    console.log("🚀 ~ findUserChars ~ error:", error);
    res.status(500).json(error);
  }
};

export const findChat = async (req: Request, res: Response) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json(chat);
  } catch (error) {
    console.log("🚀 ~ findUserChars ~ error:", error);
    res.status(500).json(error);
  }
};
