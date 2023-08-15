import { Server as SocketServer } from "socket.io";
import http from "../app";
import chatRoomSocket from "./chat-room.socket";
import globalSocket from "./global.socket";

const io = new SocketServer(http, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

export const globalSpace = io.of("/global");
export const chatRoomSpace = io.of("/chat");

globalSpace.on("connection", (socket) => {
  console.log("알람 소켓을 연결하였습니다.");
  const { watchJoin, watchSend } = globalSocket(socket);

  watchJoin();
  watchSend();
});

chatRoomSpace.on("connection", (socket) => {
  console.log("채팅방 소켓을 연결되었습니다.");
  const { watchJoin, watchSend, watchDisconnect } = chatRoomSocket(socket);

  watchJoin();
  watchSend();
  watchDisconnect();
});
