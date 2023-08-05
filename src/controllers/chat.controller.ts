import { Request, Response } from "express";
import ChatRoomModel from "../models/chat/chat-room.model";
import { CustomRequest } from "../types/request.type";
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

// GET 채팅방 하나 - 채팅방상세 - page 네이션
const getChattingRoom = async (req: Request, res: Response) => {
  try {
    const {
      user: { id },
      params: { roomId },
    } = req as CustomRequest;

    if (!id) return responseHandler.notFound(res);

    const chattingRooms = await ChatRoomModel.findById(roomId);

    responseHandler.ok(res, chattingRooms);
  } catch {
    responseHandler.error(res);
  }
};

// 채팅방 생성
const createChattingRoom = async (req: Request, res: Response) => {
  try {
    const {
      user: { id },
      body: { guestId },
    } = req as CustomRequest;

    const chatRoom = new ChatRoomModel({
      user: id,
      host: id,
      member: guestId,
    });
    const createChattingRoom = await chatRoom.save();
    responseHandler.created(res, createChattingRoom);
  } catch {
    responseHandler.error(res);
  }
};

// 채팅방 삭제
const deleteChattingRoom = async (req: Request, res: Response) => {
  try {
    const {
      user: { id },
      params: { roomId },
    } = req as CustomRequest;

    const chattingRoom = await ChatRoomModel.findById(roomId);
    if (!chattingRoom) return responseHandler.notFound(res);

    const deleteAuth = chattingRoom.host !== id;

    if (!deleteAuth) {
      return responseHandler.unauthorize(res, "삭제 권한이 없습니다.");
    }
    // chattingRoom.isDelete = true;
    await chattingRoom.save();
    responseHandler.created(res, chattingRoom);
  } catch {
    responseHandler.error(res);
  }
};

export default {
  getChattingRooms,
  getChattingRoom,
  createChattingRoom,
  deleteChattingRoom,
};
