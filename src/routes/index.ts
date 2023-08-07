import express from "express";
import routeConfig from "../configs/route.config";
import userRoute from "./user.route";
import chatRoute from "./chat.route";

const router = express.Router();

router.use(routeConfig.auth, userRoute);
router.use(routeConfig.chat, chatRoute);

export default router;
