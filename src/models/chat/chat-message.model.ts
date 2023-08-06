import mongoose, { Schema } from "mongoose";
import modelOptions from "../../configs/model.config";
import ModelKeyConfig from "../../configs/modelKey.config";

const messageSchema = new Schema(
  {
    chatRoom: {
      type: Schema.Types.ObjectId,
      ref: ModelKeyConfig.chatRoom,
      required: true,
    },
    sender: {
      type: Number,
      ref: ModelKeyConfig.user,
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
    return mongoose.model(ModelKeyConfig.chatMessage, messageSchema);
  }
}

const chatMessageModel = new MessageSchema();
export default chatMessageModel.getModel();
