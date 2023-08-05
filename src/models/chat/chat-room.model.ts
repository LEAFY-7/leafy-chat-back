import mongoose, { Schema } from "mongoose";
import modelOptions from "../../configs/model.config";

const leaveStatusSchema = new Schema({
  userId: {
    type: Number,
    ref: "User",
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isLeaved: {
    type: Boolean,
    required: true,
    default: false,
  },
});

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
      type: Number,
      required: true,
    },
    leaveStatus: [leaveStatusSchema],
  },
  modelOptions
);

class ChatRoomSchema {
  getModel() {
    return mongoose.model("ChatRoom", chatRoomSchema);
  }
}

const chatRoomModel = new ChatRoomSchema();
export default chatRoomModel.getModel();
