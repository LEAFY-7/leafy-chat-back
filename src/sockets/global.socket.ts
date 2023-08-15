import { globalSpace } from "./server.socket";

import SocketModel from "../models/socket/socket.model";
import EventModel from "../models/socket/socket-event.model";
import User from "../models/user/user.model";
import UserDto from "../dto/user/user.dto";
import ChatRoom from "../models/chat/chat-room.model";
import ChatRoomDto from "../dto/chat/room.dto";
import ChatMessage from "../models/chat/chat-message.model";

const globalSocket = (socket: SocketModel["socket"]) => {
  console.log("소켓이 연결되었습니다.");

  function watchEvent({ event, listener }: SocketModel["watchEvent"]) {
    console.log("글로벌 소켓이 연결중입니다.");
    socket.on(event, async (...args: any[]) => {
      try {
        await listener(...args);
      } catch (error) {
        socket.emit("error", error);
        console.error("소켓 이벤트 에러 발생 :", error);
      }
    });
  }

  function notifyToChat({ event, data, to }: SocketModel["notifyToChat"]) {
    try {
      console.log(`${event}에 대해서 ${to}에 ${data}를 내보냅니다.`);
      globalSpace.to(to).emit(event, data);
    } catch (error) {
      console.error("전송 에러 발생 :", error);
      socket.emit("error", error);
    }
  }

  return {
    watchJoin: () => {
      watchEvent({
        event: EventModel.JOIN, // 알림 접속
        listener: async ({ me }) => {
          socket.join(me);

          const user: UserDto | null = await User.findById(+me);
          if (!user) return;

          let data: { user: UserDto; chatList: any } = {
            user,
            chatList: [],
          };
          data.user = user;

          const chatRoomIds = user.chatRoom;

          if (!chatRoomIds.length) {
            data.chatList = [];
          } else {
            const chatRooms: ChatRoomDto[] = await ChatRoom.find({
              _id: { $in: chatRoomIds },
            });

            for (const room of chatRooms) {
              if (room.host === +me) {
                const messages = await ChatMessage.find({
                  chatRoom: room._id,
                  _id: { $gte: room.hostLeaveStatus.lastLog },
                })
                  .sort({ createdAt: -1 })
                  .limit(1);

                const latestMessage = messages[0];

                const messageCount = await ChatMessage.countDocuments({
                  chatRoom: room._id,
                  _id: { $gt: room.hostLeaveStatus.lastLog },
                });

                const newChatList = {
                  latestMessage,
                  id: room._id,
                  count: messageCount,
                };

                data.chatList.push(newChatList);
              } else {
                const messages = await ChatMessage.find({
                  chatRoom: room._id,
                  _id: { $gte: room.memberLeaveStatus.lastLog },
                })
                  .sort({ createdAt: -1 })
                  .limit(1);

                const latestMessage = messages[0];

                const messageCount = await ChatMessage.countDocuments({
                  chatRoom: room._id,
                  _id: { $gt: room.hostLeaveStatus.lastLog },
                });

                const newChatList = {
                  latestMessage,
                  id: room._id,
                  count: messageCount,
                };

                data.chatList.push(newChatList);
              }
            }
          }

          return notifyToChat({
            event: EventModel.GLOBAL,
            data,
            to: me,
          });
        },
      });
    },
    watchSend: () => {
      watchEvent({
        event: EventModel.SEND_GLOBAL,
        listener: async ({ me }) => {
          const user: UserDto | null = await User.findById(+me);
          if (!user) return;

          let data: { user: UserDto; chatList: any } = {
            user,
            chatList: [],
          };
          data.user = user;

          const chatRoomIds = user.chatRoom;

          if (!chatRoomIds.length) {
            data.chatList = [];
          } else {
            const chatRooms: ChatRoomDto[] = await ChatRoom.find({
              _id: { $in: chatRoomIds },
            });

            for (const room of chatRooms) {
              const messages = await ChatMessage.find({
                chatRoom: room._id,
                _id: { $gt: room.hostLeaveStatus.lastLog },
              })
                .sort({ createdAt: -1 })
                .limit(1);

              if (messages.length > 0) {
                const latestMessage = messages[0];

                const messageCount = await ChatMessage.countDocuments({
                  chatRoom: room._id,
                  _id: { $gt: room.hostLeaveStatus.lastLog },
                });

                const newChatList = {
                  latestMessage,
                  id: room._id,
                  count: messageCount,
                };

                data.chatList.push(newChatList);
              }
            }
          }

          return notifyToChat({
            event: EventModel.RECEIVE_GLOBAL,
            data,
            to: me,
          });
        },
      });
    },
  };
};
export default globalSocket;
