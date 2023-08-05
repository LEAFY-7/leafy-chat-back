import mongoose, { Schema } from "mongoose";
import modelOptions from "../../configs/model.config";

const messageSchema = new Schema(
  {
    chatRoom: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    sender: {
      type: Number,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  modelOptions
);

class MessageSchema {
  getModel() {
    return mongoose.model("ChatMessage", messageSchema);
  }
}

const chatMessageModel = new MessageSchema();
export default chatMessageModel.getModel();
