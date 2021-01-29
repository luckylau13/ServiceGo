require("dotenv").config();

import { createServer } from "http";
const PORT = process.env.PORT || 3000;

import { Chat } from "../src/models/chat.model";

import app from "./server";

const server = createServer(app);
const io = require("socket.io")(server);

const users = {};

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

io.on("connection", socket => {
  socket.on("new-user", name => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });
  socket.on("send-chat-message", message => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id]
    });
    const chat = new Chat({
      message: message,
      senderName: users[socket.id]
    });

    chat.save();
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});
