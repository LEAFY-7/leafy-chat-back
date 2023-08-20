import { userSpace } from "./server";

import SocketModel from "../models/socket/socket.model";
import EventModel from "../models/socket/socket-event.model";
import User from "../models/user/user.model";
import ChatRoom from "../models/chat/chat-room.model";
import ChatMessage from "../models/chat/chat-message.model";
import ChatRoomDto from "../dto/chat/room.dto";
import UserDto from "../dto/user/user.dto";

const userSocketMap = new Map();

const userSocket = (socket: SocketModel["socket"]) => {
  console.log("소켓이 연결되었습니다.");

  function watchEvent({ event, listener }: SocketModel["watchEvent"]) {
    console.log("유저 소켓에 이벤트가 실행중입니다....");

    socket.on(event, async (...args: any[]) => {
      try {
        await listener(...args);
      } catch (error) {
        socket.emit("error", error);
        console.error("소켓 이벤트 에러 발생 :", error);
      }
    });
  }

  function notifyToUser({ event, data, to }: SocketModel["notifyToUser"]) {
    try {
      console.log(`${event}에 대해서 ${to}에 ${{ data }}를 내보냅니다.`);
      userSpace.to(typeof to === "number" ? to + "" : to).emit(event, data);
    } catch (error) {
      console.error("전송 에러 발생 :", error);
      socket.emit("error", error);
    }
  }

  return {
    watchJoin: () => {
      watchEvent({
        event: EventModel.JOIN, // 유저 접속
        listener: async ({ userId }) => {
          socket.join(typeof userId === "number" ? userId + "" : userId);

          // 1. 유저 스키마 select
          const user: UserDto | null = await User.findById(+userId);
          if (!user) return; // # 에러 처리 추가

          let data: { user: UserDto; chatList: any } = {
            user,
            chatList: [],
          };
          data.user = user;

          // 채팅방 배열
          const chatRoomIds = user.chatRoom;

          if (!chatRoomIds.length) {
            data.chatList = [];
          } else {
            const chatRooms: ChatRoomDto[] = await ChatRoom.find({
              _id: { $in: chatRoomIds },
            });

            let latestMessage: any;
            let partner: UserDto | null;
            for (const room of chatRooms) {
              if (room.host === +userId) {
                const messages = await ChatMessage.find({
                  chatRoom: room._id,
                  _id: { $gte: room.hostLeaveStatus.lastLog },
                })
                  .sort({ createdAt: -1 })
                  .limit(1);

                latestMessage = messages[0];

                partner = await User.findById(room.member);
                if (!partner) {
                  partner = null;
                }
                const user = await User.findById(latestMessage.sender);

                if (!user) {
                  latestMessage.sender = null;
                }
                latestMessage.sender = user;

                const messageCount = await ChatMessage.countDocuments({
                  chatRoom: room._id,
                  _id: { $gt: room.hostLeaveStatus.lastLog },
                });

                const newChatList = {
                  latestMessage,
                  partner,
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

                latestMessage = messages[0];

                partner = await User.findById(room.host);
                if (!partner) {
                  partner = null;
                }

                const user = await User.findById(latestMessage.sender);

                if (!user) {
                  latestMessage.sender = null;
                }
                latestMessage.sender = user;

                const messageCount = await ChatMessage.countDocuments({
                  chatRoom: room._id,
                  _id: { $gt: room.memberLeaveStatus.lastLog },
                });

                const newChatList = {
                  latestMessage,
                  id: room._id,
                  partner,
                  count: messageCount,
                };

                data.chatList.push(newChatList);
              }
            }
          }

          return notifyToUser({
            event: EventModel.GET_USER,
            data: { data, userId },
            to: socket.id,
          });
        },
      });
    },
    watchSend: () => {
      watchEvent({
        event: EventModel.SEND_USER,
        listener: async ({ userId }) => {
          // socket.join(typeof userId === "number" ? userId + "" : userId);

          const user: UserDto | null = await User.findById(+userId);
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

            let latestMessage: any;
            let partner: UserDto | null;
            for (const room of chatRooms) {
              // 상대가 host이면
              if (room.host === +userId) {
                const messages = await ChatMessage.find({
                  chatRoom: room._id,
                  _id: { $gte: room.hostLeaveStatus.lastLog },
                })
                  .sort({ createdAt: -1 })
                  .limit(1);

                latestMessage = messages[0];

                partner = await User.findById(room.member);
                if (!partner) {
                  partner = null;
                }
                const user = await User.findById(latestMessage.sender);

                if (!user) {
                  latestMessage.sender = null;
                }
                latestMessage.sender = user;

                const messageCount = await ChatMessage.countDocuments({
                  chatRoom: room._id,
                  _id: { $gt: room.hostLeaveStatus.lastLog },
                });

                const newChatList = {
                  latestMessage,
                  partner,
                  id: room._id,
                  count: messageCount,
                };

                data.chatList.push(newChatList);
              } else {
                const messages = await ChatMessage.find({
                  chatRoom: room._id,
                  _id: { $gte: room.hostLeaveStatus.lastLog },
                })
                  .sort({ createdAt: -1 })
                  .limit(1);

                latestMessage = messages[0];

                partner = await User.findById(room.host);
                if (!partner) {
                  partner = null;
                }

                const user = await User.findById(latestMessage.sender);

                if (!user) {
                  latestMessage.sender = null;
                }
                latestMessage.sender = user;

                const messageCount = await ChatMessage.countDocuments({
                  chatRoom: room._id,
                  _id: { $gt: room.memberLeaveStatus.lastLog },
                });

                const newChatList = {
                  latestMessage,
                  id: room._id,
                  partner,
                  count: messageCount,
                };

                data.chatList.push(newChatList);
              }
            }
          }

          // const targetId = userSocketMap.get(userId);
          // console.log("보내는 아이디", targetId);
          return notifyToUser({
            event: EventModel.GET_USER,
            data: { data, userId },
            to: userId,
          });
        },
      });
    },
    watchEnterRoom: () => {
      watchEvent({
        event: EventModel.ENTER_ROOM,
        listener: async ({ userId, roomId }) => {
          const user: UserDto | null = await User.findById(+userId);
          if (!user) return;

          const chatRoom: ChatRoomDto | null = await ChatRoom.findById(roomId);

          if (!chatRoom) return;

          if (chatRoom.host === +userId) {
            const latestMessage = await ChatMessage.find({ chatRoom: roomId })
              .sort({ createdAt: -1 })
              .limit(1)
              .exec();

            if (!latestMessage.length) return;

            chatRoom.hostLeaveStatus.lastLog = latestMessage[0]._id;
            chatRoom.save();
          } else {
            const latestMessage = await ChatMessage.find({ chatRoom: roomId })
              .sort({ createdAt: -1 })
              .limit(1)
              .exec();

            if (!latestMessage.length) return;

            chatRoom.memberLeaveStatus.lastLog = latestMessage[0]._id;
            chatRoom.save();
          }
        },
      });
    },
  };
};
export default userSocket;
