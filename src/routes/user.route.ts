import express from "express";
import routeConfigs from "../configs/route.config";
import userController from "../controllers/user.controller";

const router = express.Router();

router.post(routeConfigs.signup, userController.signUp);
router.put(routeConfigs.updateUser, userController.updateUserInfo);

export default router;
