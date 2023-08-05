import { Request, Response, RequestHandler } from "express";
import User from "../models/user/user.model";
import responseHandler from "../handlers/response.handler";

// 회원가입
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

/**
 * 메시지 - 소켓
 * 
 * 유저
 * 1. 회원가입 - 이미지 기본 이미지 추가
 * 2. 정보수정 - 이름, 닉네임, 이미지 URL
 * 
 * 
 * 채팅방
 * 1. 채팅방 개설
 * 
 // 호스트, 멤버 입력

// 1. leave 먼저 보고 있으면
// 2. 방을 안만들고, 


// 채팅하기 버튼 누르면 나의 아이디와 상대의 아이디로 채팅방을 조회한다. GET /


// if
// 채팅방이 존재하지 않는다면 메시지를 보낼때 새로운 채팅방을 개설하고 메시지를 보낸다. GET return
// 채팅방이 존재하고 leave 스키마에 나의 정보가 없다면 채팅을 이어간다. 
// 채팅방이 존재하고 leave 스키마에 나의 정보가 있다면 채팅방을 생성하지 않고 나간 날짜 이후의 메시지를 가져온다.

 */
