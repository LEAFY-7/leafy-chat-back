import express from "express";
import userRoute from "./user.route";
import chatRoute from "./chat.route";

const router = express.Router();

router.use("/auth", userRoute);
router.use("/chat", chatRoute);

export default router;
