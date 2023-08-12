import { Request, Response } from "express";
import ChatRoom from "../models/chat/chat-room.model";
import ChatRoomDto from "../dto/chat/room.dto";
import { CustomRequest } from "../types/request.type";
import errorMessagesConfigs from "../configs/error-messages.config";
import responseHandler from "../handlers/response.handler";

/**
 * 채팅방 목록 조회 / GET
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
 * 채팅방 상세 조회 / GET
 *
 * 보여줄
 * 1. 총 페이지
 * 2. PAGE SIZE = 20
 */
const getChatRoom = async (req: Request, res: Response) => {
  try {
    const {
      params: { roomId },
      room: { host, member },
      body: { userId },
      query: { page = 1, pageSize = 20, lastMessageId = "" },
    } = req as CustomRequest;

    if (!userId) return responseHandler.notFound(res);
  } catch {
    responseHandler.error(res);
  }
};

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

// 채팅방 삭제
const deleteChatRoom = async (req: Request, res: Response) => {
  try {
    const {
      params: { roomId },
      room: { host, member },
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

    if (host === userId) {
      chatRoom.hostDeletedStatus.isDeleted = true;
    }
    if (member === userId) {
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
