import mongoose, { Schema } from "mongoose";
import ModelOptionsClass from "./modelOptions";

const messageSchema = new Schema(
  {
    chatRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    senderId: {
      type: Number,
    },
    text: {
      type: String,
    },
  },
  ModelOptionsClass.modelOptions
);

class MessageSchema {
  static getModel() {
    return mongoose.model("ChatMessage", messageSchema);
  }
}

export default MessageSchema.getModel();
