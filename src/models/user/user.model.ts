import mongoose from "mongoose";
import { IUser, IUserModel } from "../../types/user.type";
import modelOptions from "../../configs/model.config";

const userSchema = new mongoose.Schema<IUser>(
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
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  modelOptions
);

class UserSchema {
  getModel(): IUserModel {
    return mongoose.model<IUser, IUserModel>("User", userSchema);
  }
}

const userModel = new UserSchema();
export default userModel.getModel();
