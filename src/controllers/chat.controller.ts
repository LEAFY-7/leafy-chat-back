import { Request, Response } from "express";
import ChatRoomModel from "../models/chat/chat-room.model";
import ChatRoomDto from "../dto/chat/room.dto";
import { CustomRequest } from "../types/request.type";
import errorMessagesConfigs from "../configs/errorMessages.config";
import responseHandler from "../handlers/response.handler";

// GET 사용자의 채팅방 목록
const getChattingRooms = async (req: Request, res: Response) => {
  try {
    const {
      user: { id },
    } = req as CustomRequest;

    if (!id) return responseHandler.notFound(res);

    const chattingRooms = await ChatRoomModel.find({
      user: id,
      host: id,
    }).sort("-createdAt");

    responseHandler.ok(res, chattingRooms);
  } catch {
    responseHandler.error(res);
  }
};

// GET 채팅방 상세  page 네이션
const getChattingRoom = async (req: Request, res: Response) => {
  try {
    const {
      params: { roomId },
      room: { host, member },
      body: { userId },
      query: { page = 1, pageSize = 10, lastMessageId = "" },
    } = req as CustomRequest;

    if (!userId) return responseHandler.notFound(res);
    const chatRoom = await ChatRoomModel.findById(roomId);

    responseHandler.ok(res, chatRoom);
  } catch {
    responseHandler.error(res);
  }
};

// 채팅방 삭제
const deleteChattingRoom = async (req: Request, res: Response) => {
  try {
    const {
      params: { roomId },
      room: { host, member },
      body: { userId },
    } = req as CustomRequest;

    const chatRoom: ChatRoomDto | null = await ChatRoomModel.findById(roomId);

    if (!chatRoom) {
      return responseHandler.notFound(res, errorMessagesConfigs.notFoundRoom);
    }

    if (chatRoom.member !== userId || chatRoom.host !== userId) {
      return responseHandler.unauthorize(
        res,
        errorMessagesConfigs.unauthorizeRoom
      );
    }

    if (host === userId) {
      chatRoom.hostLeavedStatus.isLeaved = true;
    }
    if (member === userId) {
      chatRoom.memberLeavedStatus.isLeaved = true;
    }
    await chatRoom.save();
    responseHandler.ok(res, "삭제가 완료되었습니다.");
  } catch {
    responseHandler.error(res);
  }
};

export default {
  getChattingRooms,
  getChattingRoom,
  deleteChattingRoom,
};
