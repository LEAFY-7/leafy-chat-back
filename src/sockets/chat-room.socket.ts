import _ from "lodash";
import { chatRoomSpace } from "./server.socket";

import ChatRoomDto from "../dto/chat/room.dto";
import ChatMessageDto from "../dto/chat/message.dto";

import ChatRoom from "../models/chat/chat-room.model";
import ChatMessage from "../models/chat/chat-message.model";
import SocketModel from "../models/socket/socket.model";
import EventModel from "../models/socket/socket-event.model";

const chatRoomSocket = (socket: SocketModel["socket"]) => {
  console.log("채팅 소켓이 연결되었습니다.");

  function watchEvent({ event, listener }: SocketModel["watchEvent"]) {
    console.log("소켓이 연결중입니다.");
    socket.on(event, async (...args: any[]) => {
      try {
        await listener(...args);
      } catch (error) {
        console.error("소켓 이벤트 에러 발생 :", error);
        socket.emit("error", "서버에서 에러가 발생했습니다.");
      }
    });
  }

  function notifyToChat({ event, data, to }: SocketModel["notifyToChat"]) {
    try {
      console.log(`${event}에 대해서 ${to}에 ${data}를 내보냅니다.`);
      chatRoomSpace.to(to).emit(event, data);
    } catch (error) {
      console.error("Socket notification error:", error);
      socket.emit("error", "소켓 메시지 전송 중 에러가 발생했습니다.");
    }
  }

  function notifyError({ event, to, error }: SocketModel["notifyError"]) {
    try {
      console.log("에러가 발생했습니다.", error);
      chatRoomSpace.to(to).emit(event, error);
    } catch (error) {
      console.error("Socket error notification error:", error);
      socket.emit("error", "소켓 에러 메시지 전송 중 에러가 발생했습니다.");
    }
  }

  return {
    watchJoin: () => {
      watchEvent({
        event: EventModel.JOIN, // 채팅방 접속
        listener: async ({ roomId, me, you }) => {
          const handshake = socket.handshake; // const { query } = handshake;

          const isRoom = (await ChatRoom.findById(roomId)) !== null;

          let chatRoom: ChatRoomDto | null = await ChatRoom.findById(roomId);
          let messages: ChatMessageDto[];

          if (!isRoom) {
            chatRoom = await new ChatRoom({
              _id: roomId,
              host: +me,
              member: +you,
              hostDeletedStatus: {
                _id: +me,
              },
              memberDeletedStatus: {
                _id: +you,
              },
              hostLeaveStatus: {
                _id: +me,
              },
              memberLeaveStatus: {
                _id: +you,
              },
            });
            await chatRoom.save();
          }
          socket.join(roomId);

          if (chatRoom?.host === +me) {
            const lastLogId = chatRoom?.hostLeaveStatus.lastLog;
            const lastLogMessage = await ChatMessage.findById(lastLogId);

            if (!lastLogMessage) return;

            const earlierMessages = await ChatMessage.find({
              chatRoom: lastLogMessage.chatRoom,
              createdAt: { $lt: lastLogMessage.createdAt },
            })
              .sort({ createdAt: -1 })
              .limit(5);

            await ChatMessage.updateMany(
              { sender: { $ne: +you } },
              { $set: { isRead: true } }
            );

            const laterMessages = await ChatMessage.find({
              chatRoom: lastLogMessage.chatRoom,
              createdAt: { $gt: lastLogMessage.createdAt },
            })
              .sort({ createdAt: 1 })
              .limit(5);

            await ChatMessage.updateMany(
              { sender: { $ne: +you } },
              { $set: { isRead: true } }
            );

            const messagesIncludingLastLog = [
              ...earlierMessages,
              lastLogMessage,
              ...laterMessages,
            ];

            messages = _.chain(messagesIncludingLastLog)
              .uniqBy("id")
              .sortBy("createdAt")
              .value();
          } else {
            const lastLogId = chatRoom?.memberLeaveStatus.lastLog;
            const lastLogMessage = await ChatMessage.findById(lastLogId);

            if (!lastLogMessage) return;

            const earlierMessages = await ChatMessage.find({
              chatRoom: lastLogMessage.chatRoom,
              createdAt: { $lt: lastLogMessage.createdAt },
            })
              .sort({ createdAt: -1 })
              .limit(5);

            await ChatMessage.updateMany(
              { sender: { $ne: +me } },
              { $set: { isRead: true } }
            );

            const laterMessages = await ChatMessage.find({
              chatRoom: lastLogMessage.chatRoom,
              createdAt: { $gt: lastLogMessage.createdAt },
            })
              .sort({ createdAt: 1 })
              .limit(5);

            await ChatMessage.updateMany(
              { sender: { $ne: +me } },
              { $set: { isRead: true } }
            );

            const messagesIncludingLastLog = [
              ...earlierMessages,
              lastLogMessage,
              ...laterMessages,
            ];

            messages = _.chain(messagesIncludingLastLog)
              .uniqBy("id")
              .sortBy("createdAt")
              .value();
          }

          return notifyToChat({
            event: EventModel.MESSAGE_HISTORY,
            data: { messages, me },
            to: roomId,
          });
        },
      });
    },
    watchSend: () => {
      watchEvent({
        event: EventModel.SEND, // 메세지 보내기
        listener: async ({ roomId, me, text }) => {
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
            event: EventModel.RECEIVE_MESSAGE,
            data: chatMessage,
            to: roomId,
          });
        },
      });
    },
    watchDisconnect: () => {
      watchEvent({
        event: EventModel.ROOM_DISCONNECT, // 연결해제
        listener: async ({ roomId, me }) => {
          const chatRoom: ChatRoomDto | null = await ChatRoom.findById(roomId);
          const isRoom = chatRoom !== null;
          const isMessage =
            (await ChatMessage.find({ chatRoom: roomId })).length > 0;

          if (isRoom && !isMessage) {
            await ChatRoom.findByIdAndDelete(roomId);
          }

          if (isRoom && isMessage) {
            const lastMessage: ChatMessageDto | null =
              await ChatMessage.findOne({ chatRoom: roomId })
                .sort({ createdAt: -1 })
                .limit(1);

            if (!lastMessage) return;

            if (chatRoom.host === +me) {
              chatRoom.hostLeaveStatus.lastLog = lastMessage?._id;
            } else {
              chatRoom.memberLeaveStatus.lastLog = lastMessage?._id;
            }
            await chatRoom.save();
          }
        },
      });
    },
    watchError: () => {
      watchEvent({
        event: EventModel.JOIN_ERROR,
        listener: async ({ roomId }) => {
          return notifyError({
            event: EventModel.CONNECT_ERROR,
            to: roomId,
            error: "연결이 거부되었습니다..",
          });
        },
      });
    },
  };
};
export default chatRoomSocket;