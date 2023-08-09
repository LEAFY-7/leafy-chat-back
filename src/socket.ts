import { Server as SocketServer } from "socket.io";
import http from "./app";
import { SocketType, InitSocket, NotifyToChat } from "./types/socket.type";
import ChatRoom from "./models/chat/chat-room.model";
import responseHandler from "./handlers/response.handler";
import errorMessagesConfig from "./configs/error-messages.config";
import socketHandler from "./handlers/socket.handler";

import "dotenv/config";
import ChatRoomDto from "./dto/chat/room.dto";
import ChatMessage from "./models/chat/chat-message.model";
import ChatMessageDto from "./dto/chat/message.dto";
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
  console.log("여기", socket);
  const { watchJoin, watchSend } = initSocket(socket);

  watchJoin();
  watchSend();
});

const initSocket = (socket: SocketType) => {
  console.log("소켓이 연결되었습니다.");

  function watchEvent({ event, listener }: InitSocket) {
    socket.on(event, listener);
  }

  function notifyToChat({ event, data }: NotifyToChat) {
    console.log(`${event}에 대해서 ${data}를 emit합니다.`);
    chatRoomSpace.emit(event, data);
  }

  return {
    // join in room
    watchJoin: () => {
      watchEvent({
        event: "join",
        listener: async (data) => {
          const handshake = socket.handshake; // const { query } = handshake;
          const { roomId, myId } = data;
          socket.join(roomId);

          const chatRoom: ChatRoomDto | null = await ChatRoom.findById(roomId);

          if (!chatRoom) {
            return socketHandler.socketError("error", socket);
          }

          const isMyIdHost = chatRoom.host === +myId;
          const isYouIdIdMember = chatRoom.member === +myId;

          if (!isMyIdHost && !isYouIdIdMember) {
            return socketHandler.unauthorize("unauthorize", socket);
          }

          const messages: ChatMessageDto[] = await ChatMessage.find({
            chatRoom: roomId,
          })
            .sort({ createdAt: -1 })
            .limit(20);

          notifyToChat({
            event: "messageHistory",
            data: messages,
          });
        },
      });
    },
    // Send a Message
    watchSend: () => {
      watchEvent({
        event: "send",
        listener: async (data) => {
          const { roomId, myId, text } = data;

          const chatMessage: ChatMessageDto = new ChatMessage({
            chatRoom: roomId,
            sender: myId,
            text,
            isRead: false,
          });

          try {
            await chatMessage.save();
          } catch (error) {
            console.error("Error saving chat message:", error);
          }
          notifyToChat({
            event: "receiveMessage",
            data: chatMessage,
          });
        },
      });
    },
  };
};
