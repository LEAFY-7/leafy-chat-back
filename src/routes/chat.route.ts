import express from "express";
import chatRoomController from "../controllers/chat-room.controller";
import tokenMiddleware from "../middlewares/token.middleware";
import chatRoomMiddleware from "../middlewares/room-token.middleware";
import routeConfigs from "../configs/routeConfig";

const router = express.Router({ mergeParams: true });

router.get(
  routeConfigs.root,
  tokenMiddleware.auth,
  chatRoomController.getChatRooms
);
router.get("/:roomId", tokenMiddleware.auth, chatRoomController.getChatRoom);
router.post(routeConfigs.root, chatRoomController.createChatRoom);
router.delete(
  "/:roomId",
  chatRoomMiddleware.authorizedRoom,
  chatRoomController.deleteChatRoom
);

export default router;
