import express from "express";
import routeConfigs from "../configs/route.config";
import tokenMiddleware from "../middlewares/token.middleware";
import chatRoomMiddleware from "../middlewares/room-token.middleware";
import chatRoomController from "../controllers/chat-room.controller";

const router = express.Router({ mergeParams: true });

router.get(
  routeConfigs.root,
  tokenMiddleware.auth,
  chatRoomController.getChatRooms
);
router.get(
  routeConfigs.roomId,
  tokenMiddleware.auth,
  chatRoomController.getChatRoom
);
router.post(routeConfigs.root, chatRoomController.createChatRoom);
router.delete(
  routeConfigs.roomId,
  chatRoomMiddleware.authorizedRoom,
  chatRoomController.deleteChatRoom
);

export default router;
