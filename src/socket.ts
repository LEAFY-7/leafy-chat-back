import { Server as SocketServer } from "socket.io";
import http from "./app";
import "dotenv/config";
import { SocketType, InitSocket, NotifyToChat } from "./types/socket.type";
import ChatRoomModel from "./models/chat/chat-room.model";
import responseHandler from "./handlers/response.handler";
import errorMessagesConfig from "./configs/errorMessages.config";
import socketHandler from "./handlers/socket.handler";

const io = new SocketServer(http, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const globalSpace = io.of("/global");
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
  const { watchJoin } = initSocket(socket);

  watchJoin();
});

const initSocket = (socket: SocketType) => {
  console.log("소켓이 연결되었습니다.");

  function watchEvent({ event, listener }: InitSocket) {
    socket.on(event, listener);
  }

  function notifyToChat({ event, data }: NotifyToChat) {
    console.log("chatSpace 데이터를 emit합니다.");
    chatRoomSpace.emit(event, data);
  }

  return {
    watchJoin: () => {
      watchEvent({
        event: "join",
        listener: async (data) => {
          const handshake = socket.handshake;
          const { query } = handshake;
          const { roomId } = data;

          const chatRoom = await ChatRoomModel.findById(roomId);

          if (!chatRoom) {
            socketHandler.socketError("error", socket);
          }
          console.log("chatRoom", chatRoom);
        },
      });
    },
  };
};
// const ChatRoom = await ChatRoomModel.find({})
// const {room} = data
