import { Server as SocketServer } from "socket.io";
import http from "../app";
import chatRoomSocket from "./chat-room.socket";
import userSocket from "./user.socket";

const io = new SocketServer(http, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

export const userSpace = io.of("/user");
export const chatRoomSpace = io.of("/chat");

userSpace.on("connection", (socket) => {
  console.log("유저 소켓을 연결하였습니다.....");
  const { watchJoin, watchSend } = userSocket(socket);

  watchJoin();
  watchSend();
});

chatRoomSpace.on("connection", (socket) => {
  console.log("채팅방 소켓을 연결되었습니다.");
  const { watchJoin, watchSend, watchEnter, watchDisconnect } =
    chatRoomSocket(socket);

  watchJoin();
  watchSend();
  watchEnter();
  watchDisconnect();
});
