import { Request, Response, RequestHandler } from "express";
import User from "../models/user/user.model";
import UserDto from "../dto/user/user.dto";
import errorMessagesConfigs from "../configs/error-messages.config";
import responseHandler from "../handlers/response.handler";
import ChatRoom from "../models/chat/chat-room.model";

/**
 * @description 회원가입
 */
const signUp: RequestHandler = async (req: Request, res: Response) => {
  try {
    const {
      body: { userId, email, nickName },
    } = req;
    const checkUser: UserDto | null = await User.findById(userId);
    if (checkUser) {
      return responseHandler.badRequest(
        res,
        errorMessagesConfigs.http.duplicateUserId
      );
    }
    const newUser: UserDto | null = new User({
      _id: userId,
      email,
      nickName,
      profileImage: "",
      chatRoom: [],
    });
    const createdUser = await newUser.save();
    responseHandler.created(res, createdUser);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * @description 회원정보 수정
 */
const updateUserInfo: RequestHandler = async (req: Request, res: Response) => {
  try {
    const {
      body: { userId, nickName, profileImage },
    } = req;

    const user: UserDto | null = await User.findById(+userId);

    if (!user) {
      return responseHandler.notFound(
        res,
        errorMessagesConfigs.http.notFoundUser
      );
    }

    // if (email) user.email = email;
    if (nickName) user.nickName = nickName;
    if (profileImage) user.profileImage = profileImage;

    const updatedUser: UserDto = await user.save();
    responseHandler.ok(res, updatedUser);
  } catch {
    responseHandler.error(res);
  }
};

const clearUserChatRoom: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      params: { userId },
    } = req;

    const user: UserDto | null = await User.findById(+userId);

    if (!user) {
      return responseHandler.notFound(
        res,
        errorMessagesConfigs.http.notFoundUser
      );
    }

    user.chatRoom = [];
    const updatedUser: UserDto = await user.save();
    responseHandler.ok(res, updatedUser);
  } catch {
    responseHandler.error(res);
  }
};

const clearNoMessageChatRoom: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      params: { userId },
    } = req;

    const user: UserDto | null = await User.findById(+userId);
    if (!user) {
      return responseHandler.notFound(
        res,
        errorMessagesConfigs.http.notFoundUser
      );
    }

    const chatRoomList = user.chatRoom;

    const validChatRoomList = await Promise.all(
      chatRoomList.map(async (chatRoomId) => {
        const chatRoom = await ChatRoom.findById(chatRoomId);
        return chatRoom ? chatRoomId : null;
      })
    );

    const filteredChatRoomList = validChatRoomList.filter(
      (chatRoomId): chatRoomId is string => chatRoomId !== null
    );

    user.chatRoom = filteredChatRoomList;
    const clearedUser = await user.save();
    responseHandler.ok(res, clearedUser);
  } catch {
    responseHandler.error(res);
  }
};

export default {
  signUp,
  updateUserInfo,
  clearUserChatRoom,
  clearNoMessageChatRoom,
};
