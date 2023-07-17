import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
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
  {
    timestamps: true,
  }
);

class UserSchema {
  static getModel() {
    return mongoose.model("User", userSchema);
  }
}

export default UserSchema.getModel();
