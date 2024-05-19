import "reflect-metadata";
import "dotenv/config";
import mongoose from "mongoose";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import http from "http";

//Import routes
import userRoutes from "./routes/users.route";
import chatRoutes from "./routes/chat.route";
import messageRoutes from "./routes/message.route";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });
let onlineUsers: { userId: string; socketId: string }[] = [];

app.use(express.json());
app.use(cors());

//Use routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

io.on("connection", (socket) => {
  console.log("New connection: ", socket.id);

  //listen to a connection
  socket.on("addNewUser", (userId: string) => {
    if (userId) {
      !onlineUsers.some((user) => user.userId === userId) &&
        onlineUsers.push({
          userId,
          socketId: socket.id,
        });
    }
    io.emit("getOnlineUsers", onlineUsers);
  });

  //add message
  socket.on("sendMessage", (message) => {
    const recipient = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );

    if (recipient) {
      io.to(recipient.socketId).emit("getMessage", message);
      io.to(recipient.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),                                                                                 
      })
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URL;

server.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connection established!"))
  .catch((err) => console.log("MongoDB connection failed: ", err.message));
