import { Request, Response, NextFunction } from "express";
import ChatRoomModel from "../models/chat/chat-room.model";
import responseHandler from "../handlers/response.handler";
import userModel from "../models/chat/chat-room.model";
import { CustomRequest } from "../types/request.type";
import ChatRoomDto from "../dto/chat/room.dto";

const findRoom = async (req: Request) => {
  try {
    const roomId = req.params.roomId;
    const chatRoom: ChatRoomDto | null = await ChatRoomModel.findById(roomId);
    if (chatRoom) {
      const roomInUser = chatRoom._id.split("_");
      const host = +roomInUser[0] || undefined;
      const member = +roomInUser[2] || undefined;
      if (host && member) {
        (req as CustomRequest).room.host = host;
        (req as CustomRequest).room.member = member;
        return true;
      }
      return false;
    }
  } catch {
    return false;
  }
};

const authorizedRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { userId },
  } = req;
  const user = await userModel.findById(userId);
  if (!user) return responseHandler.unauthorize(res);

  const foundRoom = findRoom(req);
  if (!foundRoom) return responseHandler.unauthorize(res);

  // (req as CustomRequest).user = userId;

  next();
};

export default { authorizedRoom, findRoom };
