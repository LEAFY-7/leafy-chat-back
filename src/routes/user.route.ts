import express from "express";
import routeConfigs from "../configs/route.config";
import userController from "../controllers/user.controller";

const router = express.Router();

router.post(routeConfigs.signup, userController.signUp);
router.post(routeConfigs.updateUser, userController.updateUserInfo);
router.get(
  `${routeConfigs.clearUserChatRoom}/:userId`,
  userController.clearUserChatRoom
);
router.get(
  `${routeConfigs.clearNoMessageChatRoom}/:userId`,
  userController.clearNoMessageChatRoom
);
export default router;
