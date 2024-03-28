import { Server } from "socket.io";

const io = new Server({ cors: { origin: "http://localhost:5173" } });

let onlineUsers: { userId: string; socketId: string }[] = [];

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
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
