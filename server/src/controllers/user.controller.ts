import { Request, Response, RequestHandler } from "express";
import userModel from "../models/user.model";
import responseHandler from "../handlers/response.handler";

const signUp: RequestHandler = async (req: Request, res: Response) => {
  try {
    const {
      body: { email, userId, name, nickName },
    } = req;

    const checkUser = await userModel.findById(userId);

    if (checkUser) {
      return responseHandler.badRequest(res, "아이디가 존재하지 않습니다.");
    }
    const createdUser = new userModel({
      _id: userId,
      email,
      name,
      nickName,
    });

    await createdUser.save();

    responseHandler.created(res, {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      nickName: createdUser.nickName,
    });
  } catch {
    responseHandler.error(res);
  }
};

export default { signUp };
