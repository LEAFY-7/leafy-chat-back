import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

class ChatSchema {
  static getModel() {
    return mongoose.model("Chat", chatSchema);
  }
}

export default ChatSchema.getModel();
