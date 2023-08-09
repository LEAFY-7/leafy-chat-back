import express from "express";
import chatMessageController from "../controllers/chat-message.controller";

const router = express.Router({ mergeParams: true });
router.get("/:roomId", chatMessageController.getChatRoomMessages);

export default router;
