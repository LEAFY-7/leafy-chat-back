import express from "express";
import routeConfig from "../configs/route.config";
import userRoute from "./user.route";
import chatRoute from "./chat-room.route";
import chatMessageRoute from "./chat-message.route";

const router = express.Router();

router.use(routeConfig.auth, userRoute);
router.use(routeConfig.chatRoom, chatRoute);
router.use(routeConfig.chatMessage, chatMessageRoute);

export default router;
