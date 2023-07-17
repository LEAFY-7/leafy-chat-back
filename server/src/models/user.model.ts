import mongoose, { Schema } from "mongoose";
import ModelOptionsClass from "./modelOptions";

const userSchema = new Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    nickName: {
      type: String,
      required: true,
    },
  },
  ModelOptionsClass.modelOptions
);

class UserSchema {
  static getModel() {
    return mongoose.model("User", userSchema);
  }
}
export default UserSchema.getModel();
