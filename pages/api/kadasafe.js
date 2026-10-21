import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const http = createServer(app);

export default function handler(req, res) {
  // res.status(200).json({ name: "John Doe" });

  const socketio = new Server(http);
  console.log("hello");

  socketio.use((socket, next) => {
    const user_id = socket.handshake.auth.user_id;
    socket.join(user_id);

    if (!user_id) {
      console.log("invalid user");
      return next(new Error("Invalid user"));
    }
    socket.user_id = user_id;
    // console.log(socket.user_id);
    next();
  });

  socketio.on("connection", (userSocket) => {
    // console.log("something please ", userSocket.id);

    const users = [];

    for (const [, user_id] of socketio.of("/").sockets) {
      users.push(user_id.user_id);
    }

    // console.log(users);

    socketio.of("/").emit("online_users", users);

    userSocket.on("check_online", (data) => {
      userSocket.to(data).emit("online_users", users);
    });

    userSocket.on("send_message", (data) => {
      console.log(data);
      userSocket.to(data.receiver_id).emit("receive_message", data);
    });

    userSocket.on("send_typing_status", (data) => {
      console.log(data);
      userSocket.to(data.receiver_id).emit("receive_typing_status", data);
    });

    userSocket.on("logout", (data) => {
      const index = users.indexOf(data);
      if (index > -1) users.splice(index, 1);
      socketio.of("/").in(data).local.disconnectSockets();
      userSocket.broadcast.emit("user_disconnected", users);
      console.log(`${data} is now offline`);
      console.log("current online users: ", users);
    });
  });

  res.send("Node Server is running. Yay!!");
}
