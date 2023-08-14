import { Request, Response } from "express";
import mongoose from "mongoose";
import _ from "lodash";

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

    if (!lastMessageId) {
      return responseHandler.ok(res, []);
    }
    let messages: ChatMessageDto[];

    const query = {
      _id: { $lt: new mongoose.Types.ObjectId(lastMessageId) },
      chatRoom: roomId,
    };
    const foundChatMessage = await ChatMessage.find(query, null)
      .sort({ createdAt: -1 })
      .limit(+pageSize);

    messages = _.chain(foundChatMessage)
      .uniqBy("id")
      .sortBy("createdAt")
      .value();

    responseHandler.ok(res, messages);
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

    if (!lastMessageId) {
      return responseHandler.ok(res, []);
    }

    let messages: ChatMessageDto[];

    const query = {
      _id: { $gt: new mongoose.Types.ObjectId(lastMessageId) },
      chatRoom: roomId,
    };

    const foundChatMessage: ChatMessageDto[] = await ChatMessage.find(
      query,
      null
    )
      .sort({ createdAt: 1 })
      .limit(+pageSize);

    messages = foundChatMessage;

    responseHandler.ok(res, messages);
  } catch {
    responseHandler.error(res);
  }
};
export default { getPrevChatRoomMessages, getNextChatRoomMessages };
