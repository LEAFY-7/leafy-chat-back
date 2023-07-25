import express from "express";
import chatController from "../controllers/chat.controller";
import tokenMiddleware from "../middlewares/token.middleware";

const router = express.Router({ mergeParams: true });

router.get("/", tokenMiddleware.auth, chatController.getChattingRooms);
router.get("/:roomId", tokenMiddleware.auth, chatController.getChattingRoom);
router.post("/", tokenMiddleware.auth, chatController.createChattingRoom);
router.delete(
  "/:roomId",
  tokenMiddleware.auth,
  chatController.deleteChattingRoom
);

export default router;
