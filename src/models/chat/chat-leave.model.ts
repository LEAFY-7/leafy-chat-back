import mongoose, { Schema } from "mongoose";
import ModelOptionsClass from "../modelOptions";
import modelOptions from "../modelOptions";

const chatLeaveSchema = new Schema(
  {
    chatRoom: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
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
    return mongoose.model("ChatLeave", chatLeaveSchema);
  }
}

const chatLeaveModel = new ChatLeaveSchema();
export default chatLeaveModel.getModel();
