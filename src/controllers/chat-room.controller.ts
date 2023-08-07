import { Request, Response } from "express";
import ChatRoomModel from "../models/chat/chat-room.model";
import ChatRoomDto from "../dto/chat/room.dto";
import { CustomRequest } from "../types/request.type";
import errorMessagesConfigs from "../configs/errorMessages.config";
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

    const chattingRooms = await ChatRoomModel.find({
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
      body: { roomId },
    } = req;
    const [host, member] = roomId.split("_");

    const chatRoom: ChatRoomDto | null = new ChatRoomModel({
      _id: roomId,
      host: +host,
      member: +member,
      hostLeavedStatus: {
        _id: +host,
      },
      memberLeavedStatus: {
        _id: +member,
      },
    });
    console.log("pass", chatRoom);

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

    const chatRoom: ChatRoomDto | null = await ChatRoomModel.findById(roomId);

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
  getChatRooms,
  getChatRoom,
  deleteChatRoom,
  createChatRoom,
};
