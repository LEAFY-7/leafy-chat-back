import { Server } from "socket.io";
import http from "./app";
import "dotenv/config";
import { SocketType, InitSocket, NotifyToChat } from "./types/socket.type";

const io = new Server(http, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const chatRoomSpace = io.of("/chat");
const messageSpace = io.of("/message");

// io.on("connection", (socket) => {
//   console.log("연결되었습니다.");

//   socket.on("join", (context, callback) => {
//     console.log("join", context);
//     // const error = true;
//     // if (error) {
//     //   callback({ error: "error" });
//     // }

//     const { userId } = context;
//     if (!userId) {
//     }
//   });
//   socket.on("disconnect", () => {
//     console.log("연결이 취소되었습니다.");
//   });
// });

chatRoomSpace.on("connection", (socket) => {
  console.log("채팅방이 연결되었습니다.");
  socket.on("join", (context, callback) => {
    console.log("join", context);
  });

  socket.on("disconnect", () => {
    console.log("연결이 취소되었습니다.");
  });
});

const initSocket = (socket: SocketType) => {
  console.log("새로운 소켓이 연결되었습니다.");
  function watchEvent({ event, listener }: InitSocket) {
    socket.on(event, listener);
  }

  function notifyToChat({ event, data }: NotifyToChat) {
    console.log("chatSpace 데이터를 emit합니다.");
    chatRoomSpace.emit(event, data);
  }

  return {
    watchJoin: () => {
      // watchEvent("join", async (data) => {});
    },
  };
};
