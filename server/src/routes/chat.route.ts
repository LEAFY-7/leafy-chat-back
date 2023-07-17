import express from "express";
import chatController from "../controllers/chat.controller";
import tokenMiddleware from "../middlewares/token.middleware";

const router = express.Router({ mergeParams: true });

router.get("/:userId", tokenMiddleware.auth, chatController.getChats);

export default router;
