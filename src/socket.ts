import "dotenv/config";
import { Server as SocketServer } from "socket.io";
import http from "./app";
import chatRoomSocketController from "./controllers/chat-room-socekt.controller";

const io = new SocketServer(http, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const globalSpace = io.of("/global");
const chatRoomSpace = io.of("/chat");
const messageSpace = io.of("/message");

chatRoomSpace.on("connection", (socket) => {
  console.log("채팅방이 연결되었습니다.");

  const { watchJoin, watchSend, watchDisconnect } =
    chatRoomSocketController(socket);

  watchJoin();
  watchSend();
  watchDisconnect();
});

globalSpace.on("connection", (socket) => {});
