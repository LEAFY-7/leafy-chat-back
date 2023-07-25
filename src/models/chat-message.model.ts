import mongoose, { Schema } from "mongoose";
import ModelOptionsClass from "./modelOptions";

const messageSchema = new Schema(
  {
    chatRoom: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    sender: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["notice", "default"], // Enum with allowed values
      required: true,
      default: "default",
    },
    readCount: {
      type: Number,
      required: true,
      default: 1,
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
