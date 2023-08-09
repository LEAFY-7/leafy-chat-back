import { Request, Response } from "express";
import responseHandler from "../handlers/response.handler";
import { CustomRequest } from "../types/request.type";
import mongoose from "mongoose";
import ChatMessage from "../models/chat/chat-message.model";
import ChatMessageDto from "../dto/chat/message.dto";

/**
 * 채팅방 메시지 조회
 */
const getChatRoomMessages = async (req: Request, res: Response) => {
  try {
    const {
      params: { roomId },
      // room: { host, member },
      query: { page = 1, pageSize = 20, lastMessageId = "" },
    } = req as CustomRequest;

    if (!roomId) return responseHandler.notFound(res);

    const options = {
      skip: (+page - 1) * +pageSize,
      limit: +pageSize,
      sort: { _id: -1 },
    };
    const query = lastMessageId
      ? {
          _id: { $lt: new mongoose.Types.ObjectId(lastMessageId as string) },
          chatRoom: roomId,
        }
      : { chatRoom: roomId };
    const messages: ChatMessageDto[] = await ChatMessage.find(
      query,
      null,
      options
    );
    responseHandler.ok(res, messages);
  } catch {
    responseHandler.error(res);
  }
};

export default { getChatRoomMessages };
