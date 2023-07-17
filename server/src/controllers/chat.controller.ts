import { Request, Response, RequestHandler } from "express";
import responseHandler from "../handlers/response.handler";
import { CustomRequest } from "../types/request.type";

const getChats: RequestHandler = async (req: Request, res: Response) => {
  try {
    // const { user } = req as CustomRequest;
    // console.log(user);
    responseHandler.ok(res, { data: "ok" });
  } catch {
    responseHandler.error(res);
  }
};

export default { getChats };
