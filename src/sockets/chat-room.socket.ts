import _ from "lodash";
import { chatRoomSpace } from "./server";

import ChatRoomDto from "../dto/chat/room.dto";
import ChatMessageDto from "../dto/chat/message.dto";

import ChatRoom from "../models/chat/chat-room.model";
import ChatMessage from "../models/chat/chat-message.model";
import SocketModel from "../models/socket/socket.model";
import EventModel from "../models/socket/socket-event.model";
import User from "../models/user/user.model";
import UserDto from "../dto/user/user.dto";

const chatRoomSocket = (socket: SocketModel["socket"]) => {
  console.log("채팅 소켓이 연결되었습니다.");

  function watchEvent({ event, listener }: SocketModel["watchEvent"]) {
    console.log("소켓이 연결중입니다.");
    socket.on(event, async (...args: any[]) => {
      try {
        await listener(...args);
      } catch (error) {
        console.error("소켓 이벤트 에러 발생 :", error);
        socket.emit("error", error);
      }
    });
  }

  function notifyToChat({ event, data, to }: SocketModel["notifyToChat"]) {
    try {
      console.log(`${event}에 대해서 ${to}에 ${data}를 내보냅니다.`);
      chatRoomSpace.to(to).emit(event, data);
    } catch (error) {
      console.error("전송 에러 발생 :", error);
      socket.emit("error", error);
    }
  }

  function notifyError({ event, to, error }: SocketModel["notifyError"]) {
    try {
      console.log("에러가 발생했습니다.", error);
      chatRoomSpace.to(to).emit(event, error);
    } catch (error) {
      console.error("Socket error notification error:", error);
      socket.emit("error", error);
    }
  }

  return {
    watchJoin: () => {
      watchEvent({
        event: EventModel.JOIN, // 채팅방 접속
        listener: async ({ roomId, me, you }) => {
          // const handshake = socket.handshake;
          // const { query } = handshake;

          const isRoom = (await ChatRoom.findById(roomId)) !== null;

          let chatRoom: ChatRoomDto | null = await ChatRoom.findById(roomId);
          let messages: ChatMessageDto[];

          if (!isRoom) {
            // 방이 없을 시에, 생성
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

            const user: UserDto | null = await User.findById(+me);

            const chatRoomList = user?.chatRoom;

            if (chatRoomList && !chatRoomList.includes(roomId)) {
              chatRoomList.push(chatRoom._id);
              user.chatRoom = chatRoomList;
              user.save();
            }
          }

          // 방에 조인
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
        listener: async ({ roomId, me, you, text }) => {
          const chatRoom: ChatRoomDto | null = await ChatRoom.findById(roomId);

          if (!chatRoom) {
            return "채팅방이 없습니다.";
          }

          const user: UserDto | null = await User.findById(+me);
          const member: UserDto | null = await User.findById(+you);

          if (!user || !member) {
            return "사용자를 찾을 수 없습니다.";
          }
          const chatRoomList = user.chatRoom;
          const memberRoomList = member.chatRoom;

          if (chatRoomList && !chatRoomList.includes(roomId)) {
            chatRoomList.push(roomId);
            user.chatRoom = chatRoomList;
            user.save();
          }

          if (memberRoomList && !memberRoomList.includes(roomId)) {
            memberRoomList.push(roomId);
            member.chatRoom = memberRoomList;
            member.save();
          }

          const chatMessage: ChatMessageDto = new ChatMessage({
            chatRoom: roomId,
            sender: me,
            text,
            isRead: false,
          });

          const newChatMessage = await chatMessage.save();

          if (!chatRoom) return;

          if (chatRoom.host === +me) {
            chatRoom.hostLeaveStatus.lastLog = newChatMessage._id;
          } else {
            chatRoom.memberLeaveStatus.lastLog = newChatMessage._id;
          }
          await chatRoom.save();

          const messages: ChatMessageDto[] = await ChatMessage.find({
            chatRoom: roomId,
          })
            .sort({ createdAt: 1 })
            .limit(1);

          const latestMessage = messages[0];

          if (latestMessage.id === newChatMessage.id) {
            chatRoom.hostLeaveStatus.lastLog = newChatMessage.id;
            chatRoom.memberLeaveStatus.lastLog = newChatMessage.id;
            await chatRoom.save();
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
          const user: UserDto | null = await User.findById(+me);

          if (!user) {
            console.log("사용자를 찾을 수 없습니다.");
            return;
          }
          const isRoom = chatRoom !== null;
          const isMessage = await ChatMessage.exists({ chatRoom: roomId });

          if (isRoom) {
            if (!isMessage) {
              await ChatRoom.findByIdAndDelete(roomId);
              user.chatRoom = user.chatRoom.filter(
                (chatRoomId) => chatRoomId !== roomId
              );
              await user.save();
            } else {
              const lastMessage: ChatMessageDto | null =
                await ChatMessage.findOne({ chatRoom: roomId })
                  .sort({ createdAt: -1 })
                  .limit(1);

              if (!lastMessage) {
                console.log("최근 메시지를 찾을 수 없습니다.");
                return;
              }

              if (chatRoom.host === +me) {
                chatRoom.hostLeaveStatus.lastLog = lastMessage?._id;
              } else {
                chatRoom.memberLeaveStatus.lastLog = lastMessage?._id;
              }
              await chatRoom.save();

              await User.findByIdAndUpdate(
                +me,
                { $addToSet: { chatRoom: roomId } },
                { new: true }
              )
                .then((updatedUser) => {
                  console.log("채팅방이 추가 되었습니다.:", updatedUser);
                })
                .catch((error) => {
                  console.error(
                    "채팅방을 추가하는 도중 에러가 발생했습니다.",
                    error
                  );
                });
            }
          }
        },
      });
    },
    watchEnter: () => {
      watchEvent({
        event: EventModel.ENTER_ROOM,
        listener: async ({ userId, roomId }) => {
          const user: UserDto | null = await User.findById(+userId); // 유저 찾고
          if (!user) return;

          const chatRoom: ChatRoomDto | null = await ChatRoom.findById(roomId); // 채팅방 찾고
          if (!chatRoom) return;

          if (chatRoom.host === +userId) {
            const latestMessage = await ChatMessage.find({ chatRoom: roomId })
              .sort({ createdAt: -1 })
              .limit(1)
              .exec();

            if (!latestMessage.length) return;

            chatRoom.hostLeaveStatus.lastLog = latestMessage[0]._id;
          } else {
            const latestMessage = await ChatMessage.find({ chatRoom: roomId })
              .sort({ createdAt: -1 })
              .limit(1)
              .exec();

            if (!latestMessage.length) return;

            chatRoom.memberLeaveStatus.lastLog = latestMessage[0]._id;
          }
          await chatRoom.save();
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
