import express from "express";
import userRoute from "./user.route";
import chatRoute from "./chat.route";
import routeConfig from "../configs/routeConfig";

const router = express.Router();

router.use(routeConfig.auth, userRoute);
router.use(routeConfig.chat, chatRoute);

export default router;
