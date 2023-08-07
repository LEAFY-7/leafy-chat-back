import mongoose, { Schema } from "mongoose";
import modelKeyConfig from "../../configs/model-key.config";
import modelOptions from "../../configs/model-options.config";

const chatLeaveSchema = new Schema(
  {
    chatRoom: {
      type: Schema.Types.ObjectId,
      ref: modelKeyConfig.chatRoom,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
  },
  modelOptions
);

class ChatLeaveModel {
  private model;

  constructor() {
    this.model = mongoose.model(modelKeyConfig.chatLeave, chatLeaveSchema);
  }

  getModel() {
    return this.model;
  }
}

const ChatLeave = new ChatLeaveModel().getModel();
export default ChatLeave;
