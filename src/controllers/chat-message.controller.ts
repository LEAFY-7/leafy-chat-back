import { Request, Response } from "express";
import responseHandler from "../handlers/response.handler";
import { CustomRequest } from "../types/request.type";
import mongoose from "mongoose";
import ChatMessage from "../models/chat/chat-message.model";
import ChatMessageDto from "../dto/chat/message.dto";

/**
 * 채팅방 메시지 조회
 */
const getPrevChatRoomMessages = async (req: Request, res: Response) => {
  try {
    const {
      params: { roomId },
      query: { page = 1, pageSize = 20, lastMessageId = "" },
    } = req as CustomRequest;

    if (!roomId) return responseHandler.notFound(res);

    if (typeof lastMessageId !== "string") {
      return responseHandler.badRequest(res, "잘못된 정보입니다.");
    }

    const options = {
      skip: (+page - 1) * +pageSize,
      limit: +pageSize,
    };

    const query = lastMessageId
      ? {
          _id: { $lt: new mongoose.Types.ObjectId(lastMessageId) },
          chatRoom: roomId,
        }
      : { chatRoom: roomId };

    const messages: ChatMessageDto[] = await ChatMessage.find(
      query,
      null,
      options
    ).sort({ createdAt: -1 });

    const sortedMessages = messages.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    responseHandler.ok(res, sortedMessages);
  } catch {
    responseHandler.error(res);
  }
};

const getNextChatRoomMessages = async (req: Request, res: Response) => {
  try {
    const {
      params: { roomId },
      query: { page = 1, pageSize = 20, lastMessageId = "" },
    } = req as CustomRequest;

    if (!roomId) return responseHandler.notFound(res);

    if (typeof lastMessageId !== "string") {
      return responseHandler.badRequest(res, "잘못된 정보입니다.");
    }

    const query = lastMessageId
      ? {
          _id: { $gt: new mongoose.Types.ObjectId(lastMessageId) },
          chatRoom: roomId,
        }
      : { chatRoom: roomId };
    const messages: ChatMessageDto[] = await ChatMessage.find(query, null)
      .sort({ createdAt: 1 })
      .limit(+pageSize);

    responseHandler.ok(res, messages);
  } catch {
    responseHandler.error(res);
  }
};
export default { getPrevChatRoomMessages, getNextChatRoomMessages };
