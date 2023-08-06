import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import responseHandler from "../handlers/response.handler";
import userModel from "../models/chat/chat-room.model";
import { CustomRequest } from "../types/request.type";

const findRoom = (req: Request) => {
  try {
    return false;
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
    body: { memberId },
  } = req;
  const foundRoom = findRoom(req);
};

export default { authorizedRoom, findRoom };
