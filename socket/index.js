import { Server } from "socket.io";
import "dotenv/config";

const { SERVER_URL, PORT } = process.env;

const io = new Server(PORT, {
  cors: {
    origin: SERVER_URL,
    credentials: true,
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("connected");
});
