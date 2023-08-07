import express from "express";
import chatRoomController from "../controllers/chat-room.controller";
import tokenMiddleware from "../middlewares/token.middleware";
import chatRoomMiddleware from "../middlewares/chat-room.middleware";

const router = express.Router({ mergeParams: true });

router.get("/", tokenMiddleware.auth, chatRoomController.getChattingRooms);
router.get(
  "/:roomId",
  tokenMiddleware.auth,
  chatRoomController.getChattingRoom
);
router.delete(
  "/:roomId",
  chatRoomMiddleware.authorizedRoom,
  chatRoomController.deleteChattingRoom
);

export default router;
