import express from "express";
import userController from "../controllers/user.controller";
import routeConfigs from "../configs/routeConfig";

const router = express.Router();

router.post(routeConfigs.signup, userController.signUp);
router.put(routeConfigs.updateUser, userController.updateUserInfo);

export default router;
