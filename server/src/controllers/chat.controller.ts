import { Request, Response } from "express";
import ChatRoom from "../models/chat-room.model";
import { CustomRequest } from "../types/request.type";
import responseHandler from "../handlers/response.handler";

// GET 사용자의 채팅방 목록
const getChattingRooms = async (req: Request, res: Response) => {
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

// GET 채팅방 하나
const getChattingRoom = async (req: Request, res: Response) => {
  try {
    const {
      user: { id },
      params: { roomId },
    } = req as CustomRequest;

    if (!id) return responseHandler.notFound(res);

    const chattingRooms = await ChatRoom.findById(roomId);

    responseHandler.ok(res, chattingRooms);
  } catch {
    responseHandler.error(res);
  }
};

const createChattingRoom = async (req: Request, res: Response) => {
  try {
    const {
      user: { id },
      body: { guestId },
    } = req as CustomRequest;
    const chatRoom = new ChatRoom({
      user: id,
      host: id,
      members: [...guestId],
      showDeleted: false,
    });
    const createChattingRoom = await chatRoom.save();
    responseHandler.created(res, createChattingRoom);
  } catch {
    responseHandler.error(res);
  }
};

const deleteChattingRoom = async (req: Request, res: Response) => {
  try {
    const {
      user: { id },
      params: { roomId },
    } = req as CustomRequest;

    const chattingRoom = await ChatRoom.findById(roomId);
    if (!chattingRoom) return responseHandler.notFound(res);

    chattingRoom.showDeleted = true;
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
