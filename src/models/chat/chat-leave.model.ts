import mongoose, { Schema } from "mongoose";
import modelKeyConfig from "../../configs/modelKey.config";
import modelOptions from "../../configs/model.config";

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

class ChatLeaveSchema {
  getModel() {
    return mongoose.model(modelKeyConfig.chatLeave, chatLeaveSchema);
  }
}

const chatLeaveModel = new ChatLeaveSchema();
export default chatLeaveModel.getModel();
