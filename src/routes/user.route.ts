import express from "express";
import userController from "../controllers/user.controller";

const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/update-user", userController.updateUserInfo);

export default router;
