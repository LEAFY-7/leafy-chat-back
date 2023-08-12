import express from "express";
import chatMessageController from "../controllers/chat-message.controller";

const router = express.Router({ mergeParams: true });
router.get("/prev/:roomId", chatMessageController.getPrevChatRoomMessages);
router.get("/next/:roomId", chatMessageController.getNextChatRoomMessages);

export default router;
