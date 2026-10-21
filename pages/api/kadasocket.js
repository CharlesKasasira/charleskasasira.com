import { Server } from "socket.io";

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");

    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.broadcast.emit("a user connected");
      socket.on("hello", () => {
        socket.emit("hello", "world!");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;

// import { Server } from "socket.io";
// // import messageHandler from "../../utils/sockets/messageHandler";

// export default function SocketHandler(req, res) {
//   // It means that socket server was already initialised
//   // if (res.socket.server.io) {
//   //   console.log("Already set up");
//   //   res.end();
//   //   return;
//   // }

//   const io = new Server(res.socket.server);
//   res.socket.server.io = io;

//   console.log(io);
//   // console.log(res);

//   // const onConnection = (socket) => {
//   //   messageHandler(io, socket);
//   // };

//   // Define actions inside
//   io.on("connection", (userSocket) => {
//     console.log("connected fast");
//     console.log(userSocket);
//   });

//   console.log("Setting up socket");
//   res.end();
// }
