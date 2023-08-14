import { Request, Response } from "express";
import _ from "lodash";
import ChatRoom from "../models/chat/chat-room.model";
import ChatRoomDto from "../dto/chat/room.dto";
import errorMessagesConfigs from "../configs/error-messages.config";
import responseHandler from "../handlers/response.handler";
import { CustomRequest } from "../@types/request.type";
import ChatMessage from "../models/chat/chat-message.model";
import ChatMessageDto from "../dto/chat/message.dto";

/**
 * @description 채팅방 조회
 */
const getChatRooms = async (req: Request, res: Response) => {
  try {
    const {
      user: { id },
    } = req as CustomRequest;

    if (!id) return responseHandler.notFound(res);

    const chattingRooms = await ChatRoom.find({
      user: id,
      host: id,
    }).sort("-createdAt");

    responseHandler.ok(res, chattingRooms);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * @description 채팅방 상세 조회
 */
const getChatRoom = async (req: Request, res: Response) => {
  try {
    const {
      params: { roomId },
      query: { me, you },
    } = req;

    let chatRoom: ChatRoomDto | null = await ChatRoom.findById(roomId);
    let messages: ChatMessageDto[];

    if (chatRoom?.host === Number(me)) {
      const lastLogId = chatRoom?.hostLeaveStatus.lastLog;
      const lastLogMessage = await ChatMessage.findById(lastLogId);

      if (!lastLogMessage) return;

      const earlierMessages = await ChatMessage.find({
        chatRoom: lastLogMessage.chatRoom,
        createdAt: { $lt: lastLogMessage.createdAt },
      })
        .sort({ createdAt: -1 })
        .limit(5);

      const laterMessages = await ChatMessage.find({
        chatRoom: lastLogMessage.chatRoom,
        createdAt: { $gt: lastLogMessage.createdAt },
      })
        .sort({ createdAt: 1 })
        .limit(5);

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

      const laterMessages = await ChatMessage.find({
        chatRoom: lastLogMessage.chatRoom,
        createdAt: { $gt: lastLogMessage.createdAt },
      })
        .sort({ createdAt: 1 })
        .limit(5);

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

    responseHandler.ok(res, messages);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * @description 채팅방 생성
 */
const createChatRoom = async (req: Request, res: Response) => {
  try {
    const {
      body: { me, you },
    } = req;

    if (!me || !you) return;
    const sortedValues = [me, you].sort();
    const roomId = sortedValues.join("_");

    const chatRoom: ChatRoomDto | null = new ChatRoom({
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

    const createRoom = await chatRoom.save();
    responseHandler.created(res, createRoom);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * @description 채팅방 삭제
 */
const deleteChatRoom = async (req: Request, res: Response) => {
  try {
    const {
      params: { roomId },
      room: { me, you },
      body: { userId },
    } = req as CustomRequest;

    const chatRoom: ChatRoomDto | null = await ChatRoom.findById(roomId);

    if (!chatRoom) {
      return responseHandler.notFound(
        res,
        errorMessagesConfigs.http.notFoundRoom
      );
    }

    if (chatRoom.member !== userId || chatRoom.host !== userId) {
      return responseHandler.unauthorize(
        res,
        errorMessagesConfigs.http.unauthorizeRoom
      );
    }

    if (me === userId) {
      chatRoom.hostDeletedStatus.isDeleted = true;
    }
    if (you === userId) {
      chatRoom.memberDeletedStatus.isDeleted = true;
    }
    await chatRoom.save();
    responseHandler.ok(res, "삭제가 완료되었습니다.");
  } catch {
    responseHandler.error(res);
  }
};

export default {
  getChatRooms,
  getChatRoom,
  deleteChatRoom,
  createChatRoom,
};
