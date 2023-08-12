import "dotenv/config";
import { Server as SocketServer } from "socket.io";
import http from "./app";
import { SocketType, InitSocket, NotifyToChat } from "./types/socket.type";
import ChatRoom from "./models/chat/chat-room.model";
import responseHandler from "./handlers/response.handler";
import errorMessagesConfig from "./configs/error-messages.config";
import socketHandler from "./handlers/socket.handler";

import ChatMessage from "./models/chat/chat-message.model";
import ChatRoomDto from "./dto/chat/room.dto";
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

  const { watchJoin, watchSend, watchDisconnect } = initSocket(socket);

  watchJoin();
  watchSend();
  watchDisconnect();
});

const initSocket = (socket: SocketType) => {
  console.log("소켓이 연결되었습니다.");

  function watchEvent({ event, listener }: InitSocket) {
    socket.on(event, listener);
  }

  function notifyToChat({ event, data, to }: NotifyToChat) {
    console.log(`${event}에 대해서 ${data}를 emit합니다.`);
    chatRoomSpace.to(to).emit(event, data);
  }

  return {
    // 채팅방 접속
    watchJoin: () => {
      watchEvent({
        event: "join",
        listener: async (data) => {
          const handshake = socket.handshake; // const { query } = handshake;
          const { roomId, me, you } = data;

          console.log(roomId, me, you);
          const isRoom = (await ChatRoom.findById(roomId)) !== null;

          let chatRoom: ChatRoomDto | null = await ChatRoom.findById(roomId);

          if (!isRoom) {
            chatRoom = await new ChatRoom({
              _id: roomId,
              host: +me,
              member: +you,
              hostLeavedStatus: {
                _id: +me,
              },
              memberLeavedStatus: {
                _id: +you,
              },
            });
            await chatRoom.save();
          }

          socket.join(roomId);

          const firstUnreadMessage = await ChatMessage.findOne({
            chatRoom: roomId,
            sender: { $ne: +me },
            isRead: false,
          })
            .sort({ createdAt: 1 })
            .exec();

          let messages: ChatMessageDto[];
          if (firstUnreadMessage) {
            messages = await ChatMessage.find({
              chatRoom: roomId,
              createdAt: { $lte: firstUnreadMessage.createdAt },
            })
              .sort({ createdAt: -1 })
              .limit(10);
          } else {
            messages = await ChatMessage.find({
              chatRoom: roomId,
            })
              .sort({ createdAt: -1 })
              .limit(20);
          }

          return notifyToChat({
            event: "messageHistory",
            data: messages,
            to: roomId,
          });
        },
      });
    },
    // 메세지 보내기
    watchSend: () => {
      watchEvent({
        event: "send",
        listener: async (data) => {
          const { roomId, me, text } = data;

          const chatMessage: ChatMessageDto = new ChatMessage({
            chatRoom: roomId,
            sender: me,
            text,
            isRead: false,
          });

          try {
            await chatMessage.save();
          } catch (error) {
            console.error("Error saving chat message:", error);
          }
          return notifyToChat({
            event: "receiveMessage",
            data: chatMessage,
            to: roomId,
          });
        },
      });
    },
    // 연결해제
    watchDisconnect: () => {
      watchEvent({
        event: "roomDisconnect",
        listener: async (data) => {
          const { roomId } = data;
          const isRoom = (await ChatRoom.findById(roomId)) !== null;
          const isMessage =
            (await ChatMessage.find({ chatRoom: roomId })).length > 0;

          if (isRoom && !isMessage) {
            await ChatRoom.findByIdAndDelete(roomId);
          }
        },
      });
    },
  };
};
