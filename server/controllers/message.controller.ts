import { Request, Response } from "express";
import messageModel from "../models/message.model";

export const createMessage = async (req: Request, res: Response) => {
  const { chatId, senderId, text } = req.body;

  const message = new messageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const response = await message.save();
    res.status(200).json(response);
  } catch (error) {
    console.log("🚀 ~ createMessage ~ error:", error);
    res.status(500).json(error);
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    console.log("🚀 ~ getMessages ~ error:", error);
    res.status(500).json(error);
  }
};
