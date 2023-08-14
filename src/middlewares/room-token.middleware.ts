import { Request, Response, NextFunction } from "express";

import ChatRoomDto from "../dto/chat/room.dto";
import responseHandler from "../handlers/response.handler";
import ChatRoomModel from "../models/chat/chat-room.model";
import userModel from "../models/chat/chat-room.model";
import { CustomRequest } from "../@types/request.type";

const findRoom = async (req: Request) => {
  try {
    const roomId = req.params.roomId;
    const { me, you } = req.query;

    const newMe = Number(me);
    const newYou = Number(you);
    const chatRoom: ChatRoomDto | null = await ChatRoomModel.findById(roomId);

    if (chatRoom?.host === newMe) {
      (req as CustomRequest).room.me = newMe;
      (req as CustomRequest).room.you = newYou;
      return true;
    } else {
      (req as CustomRequest).room.me = newMe;
      (req as CustomRequest).room.you = newYou;
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
  const foundRoom = findRoom(req);
  if (!foundRoom) return responseHandler.unauthorize(res);

  next();
};

export default { authorizedRoom, findRoom };
