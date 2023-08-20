import mongoose, { Model } from "mongoose";
import UserDto from "../../dto/user/user.dto";
import modelOptions from "../../configs/model-options.config";
import modelKeyConfigs from "../../configs/model-key.config";

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
    profileImage: {
      type: String,
      required: false,
    },
    chatRoom: {
      type: [String],
      default: [],
    },
  },
  modelOptions
);

class UserModel {
  private model: IUserModel;

  constructor() {
    this.model = mongoose.model<UserDto, IUserModel>(
      modelKeyConfigs.user,
      userSchema
    );
  }
  getModel(): IUserModel {
    return this.model;
  }
}

const User = new UserModel().getModel();
export default User;
