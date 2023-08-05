import { Request, Response } from "express";
import ChatRoom from "../models/chat/chat-room.model";
import { CustomRequest } from "../types/request.type";
import responseHandler from "../handlers/response.handler";

// GET 사용자의 채팅방 목록
const getChattingRooms = async (req: Request, res: Response) => {
  try {
    const {
      user: { id },
    } = req as CustomRequest;

    if (!id) return responseHandler.notFound(res);

    const chattingRooms = await ChatRoom.find({
      user: id,
      host: id,
    }).sort("-createdAt");

    responseHandler.ok(res, chattingRooms);
  } catch {
    responseHandler.error(res);
  }
};

// GET 채팅방 하나 - 채팅방상세 - page 네이션
const getChattingRoom = async (req: Request, res: Response) => {
  try {
    const {
      user: { id },
      params: { roomId },
    } = req as CustomRequest;

    if (!id) return responseHandler.notFound(res);

    const chattingRooms = await ChatRoom.findById(roomId);

    responseHandler.ok(res, chattingRooms);
  } catch {
    responseHandler.error(res);
  }
};

// 채팅방 개설
// 호스트, 멤버 입력

// 1. leave 먼저 보고 있으면
// 2. 방을 안만들고, 


// 채팅하기 버튼 누르면 나의 아이디와 상대의 아이디로 채팅방을 조회한다. GET /


// if
// 채팅방이 존재하지 않는다면 메시지를 보낼때 새로운 채팅방을 개설하고 메시지를 보낸다. GET return
// 채팅방이 존재하고 leave 스키마에 나의 정보가 없다면 채팅을 이어간다. 
// 채팅방이 존재하고 leave 스키마에 나의 정보가 있다면 채팅방을 생성하지 않고 나간 날짜 이후의 메시지를 가져온다.



// 
const createChattingRoom = async (req: Request, res: Response) => {
  try {
    const {
      user: { id },
      body: { guestId },
    } = req as CustomRequest;
    const chatRoom = new ChatRoom({
      user: id,
      host: id,
      members: [...guestId],
      isDelete: false,
    });
    const createChattingRoom = await chatRoom.save();
    responseHandler.created(res, createChattingRoom);
  } catch {
    responseHandler.error(res);
  }
};

// 채팅방 삭제
const deleteChattingRoom = async (req: Request, res: Response) => {
  try {
    const {
      user: { id },
      params: { roomId },
    } = req as CustomRequest;

    const chattingRoom = await ChatRoom.findById(roomId);
    if (!chattingRoom) return responseHandler.notFound(res);

    const deleteAuth = chattingRoom.host !== id;

    if (!deleteAuth) {
      return responseHandler.unauthorize(res, "삭제 권한이 없습니다.");
    }
    // chattingRoom.isDelete = true;
    await chattingRoom.save();
    responseHandler.created(res, chattingRoom);
  } catch {
    responseHandler.error(res);
  }
};

export default {
  getChattingRooms,
  getChattingRoom,
  createChattingRoom,
  deleteChattingRoom,
};
