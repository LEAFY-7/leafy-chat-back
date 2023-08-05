import { Request, Response, RequestHandler } from "express";
import UserModel from "../models/user/user.model";
import responseHandler from "../handlers/response.handler";
import errorMessagesConfigs from "../configs/errorMessages.config";

// 회원가입
const signUp: RequestHandler = async (req: Request, res: Response) => {
  try {
    const {
      body: { userId, email, nickName },
    } = req;
    const checkUser = await UserModel.findById(userId);
    if (checkUser) {
      return responseHandler.badRequest(
        res,
        errorMessagesConfigs.duplicateUserId
      );
    }
    const newUser = new UserModel({
      _id: userId,
      email,
      nickName,
      imgUrl: "",
      chatRoom: [],
    });
    const createdUser = await newUser.save();
    responseHandler.created(res, createdUser);
  } catch {
    responseHandler.error(res);
  }
};

// 회원 정보 수정
const updateUserInfo: RequestHandler = async (req: Request, res: Response) => {
  try {
    const {
      body: { userId, email, nickName, imgUrl },
    } = req;

    const user = await UserModel.findById(userId);

    if (!user) {
      return responseHandler.notFound(res, errorMessagesConfigs.notFoundUser);
    }

    if (email) user.email = email;
    if (nickName) user.nickName = nickName;
    if (imgUrl) user.imgUrl = imgUrl;

    const updatedUser = await user.save();
    responseHandler.ok(res, updatedUser);
  } catch {
    responseHandler.error(res);
  }
};
export default { signUp, updateUserInfo };
