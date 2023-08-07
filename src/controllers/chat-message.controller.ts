import { Request, Response } from "express";
import responseHandler from "../handlers/response.handler";

/**
 * 채팅방 메시지 조회
 */
const getChatMessages = async (req: Request, res: Response) => {
  try {
    const {
      query: { page = 1, pageSize = 10, lastMessageId = "" },
    } = req;
  } catch {
    responseHandler.error(res);
  }
};

export default { getChatMessages };
