import express from "express";
import chatMessageController from "../controllers/chat-message.controller";
import routeConfigs from "../configs/route.config";

const router = express.Router({ mergeParams: true });
router.get(
  `${routeConfigs.prev}${routeConfigs.roomId}`,
  chatMessageController.getPrevChatRoomMessages
);
router.get(
  `${routeConfigs.next}${routeConfigs.roomId}`,
  chatMessageController.getNextChatRoomMessages
);

export default router;
