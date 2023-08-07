import express from "express";
import chatRoomController from "../controllers/chat-room.controller";
import tokenMiddleware from "../middlewares/token.middleware";
import chatRoomMiddleware from "../middlewares/chat-room/chat-room.middleware";

const router = express.Router({ mergeParams: true });

router.get("/", tokenMiddleware.auth, chatRoomController.getChatRooms);
router.get("/:roomId", tokenMiddleware.auth, chatRoomController.getChatRoom);
router.post("/", chatRoomController.createChatRoom);
router.delete(
  "/:roomId",
  chatRoomMiddleware.authorizedRoom,
  chatRoomController.deleteChatRoom
);

export default router;
