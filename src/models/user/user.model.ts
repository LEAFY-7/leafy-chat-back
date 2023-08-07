import mongoose, { Model } from "mongoose";
import modelOptions from "../../configs/model.config";
import UserDto from "../../dto/user/user.dto";
import ModelKeyConfig from "../../configs/modelKey.config";

interface IUserModel extends Model<UserDto & Document> {}

const userSchema = new mongoose.Schema<UserDto>(
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
    return mongoose.model<UserDto, IUserModel>(ModelKeyConfig.user, userSchema);
  }
}

const userModel = new UserSchema();
export default userModel.getModel();
