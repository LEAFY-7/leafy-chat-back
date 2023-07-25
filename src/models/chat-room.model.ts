import mongoose, { Schema } from "mongoose";
import ModelOptionsClass from "./modelOptions";

const chatRoomSchema = new Schema(
  {
    user: {
      type: Number,
      ref: "User",
      required: true,
    },
    host: {
      type: Number,
      required: true,
    },
    members: {
      type: [Number],
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  ModelOptionsClass.modelOptions
);

class ChatRoomSchema {
  static getModel() {
    return mongoose.model("ChatRoom", chatRoomSchema);
  }
}

export default ChatRoomSchema.getModel();
