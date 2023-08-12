import { Request, Response } from "express";
import mongoose from "mongoose";
import ChatMessage from "../models/chat/chat-message.model";
import ChatMessageDto from "../dto/chat/message.dto";
import responseHandler from "../handlers/response.handler";
import { CustomRequest } from "../@types/request.type";

/**
 * @description 메세지 조회 - 이전 데이터 무한스크롤
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

/**
 * @description 메세지 조회 - 이후 데이터 무한스크롤
 */
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
