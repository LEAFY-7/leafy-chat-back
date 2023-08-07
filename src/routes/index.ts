import express from "express";
import userRoute from "./user.route";
import chatRoute from "./chat.route";
import RouteConfig from "../configs/routeConfig";

const router = express.Router();

router.use(RouteConfig.auth, userRoute);
router.use(RouteConfig.chat, chatRoute);

export default router;
