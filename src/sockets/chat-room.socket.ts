import { chatRoomSpace } from "./server.socket";

import ChatRoomDto from "../dto/chat/room.dto";
import ChatMessageDto from "../dto/chat/message.dto";

import ChatRoom from "../models/chat/chat-room.model";
import ChatMessage from "../models/chat/chat-message.model";
import SocketModel from "../models/socket/socket.model";
import EventModel from "../models/socket/socket-event.model";

const chatRoomSocket = (socket: SocketModel["socket"]) => {
  console.log("소켓이 연결되었습니다.");

  function watchEvent({ event, listener }: SocketModel["watchEvent"]) {
    socket.on(event, listener);
  }

  function notifyToChat({ event, data, to }: SocketModel["notifyToChat"]) {
    console.log(`${event}에 대해서 ${data}를 emit합니다.`);
    chatRoomSpace.to(to).emit(event, data);
  }

  return {
    watchJoin: () => {
      watchEvent({
        event: EventModel.JOIN, // 채팅방 접속
        listener: async (data) => {
          const handshake = socket.handshake; // const { query } = handshake;
          const { roomId, me, you } = data;

          const isRoom = (await ChatRoom.findById(roomId)) !== null;

          let chatRoom: ChatRoomDto | null = await ChatRoom.findById(roomId);

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
            event: EventModel.MESSAGE_HISTORY,
            data: messages,
            to: roomId,
          });
        },
      });
    },
    watchSend: () => {
      watchEvent({
        event: EventModel.SEND, // 메세지 보내기
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
export default chatRoomSocket;
