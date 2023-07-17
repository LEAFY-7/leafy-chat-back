import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true, // 예시: 타임스탬프 옵션 추가
  }
);

class ResumeSchema {
  static getModel() {
    return mongoose.model("Chat", chatSchema);
  }
}

export default ResumeSchema.getModel();
