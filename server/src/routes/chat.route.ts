import express from "express";
import chatController from "../controllers/chat.controller";
import tokenMiddleware from "../middlewares/token.middleware";

const router = express.Router({ mergeParams: true });

router.get("/:email", tokenMiddleware.auth, chatController.getChats);

export default router;
