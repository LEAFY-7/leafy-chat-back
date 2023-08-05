import mongoose, { Schema } from "mongoose";
import modelOptions from "../../configs/model.config";

const userSchema = new Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    nickName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: false,
    },
    chatRoom: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  modelOptions
);

class UserSchema {
  getModel() {
    return mongoose.model("User", userSchema);
  }
}

const userModel = new UserSchema();
export default userModel.getModel();
