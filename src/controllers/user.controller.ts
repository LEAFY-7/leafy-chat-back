import { Request, Response, RequestHandler } from "express";
import User from "../models/user.model";
import responseHandler from "../handlers/response.handler";

const signUp: RequestHandler = async (req: Request, res: Response) => {
  try {
    const {
      body: { userId, email },
    } = req;
    const checkUser = await User.findById(userId);
    if (checkUser) {
      return responseHandler.badRequest(res, "이미 채팅 아이디가 있습니다.");
    }
    const newUser = new User({
      _id: userId,
      email,
    });
    const createdUser = await newUser.save();
    responseHandler.created(res, createdUser);
  } catch {
    responseHandler.error(res);
  }
};

export default { signUp };
