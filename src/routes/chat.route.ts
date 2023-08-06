import express from "express";
import chatController from "../controllers/chat.controller";
import tokenMiddleware from "../middlewares/token.middleware";
import chatRoomMiddleware from "../middlewares/chat-room.middleware";

const router = express.Router({ mergeParams: true });

router.get("/", tokenMiddleware.auth, chatController.getChattingRooms);
router.get("/:roomId", tokenMiddleware.auth, chatController.getChattingRoom);
router.delete(
  "/:roomId",
  chatRoomMiddleware.authorizedRoom,
  chatController.deleteChattingRoom
);

export default router;
