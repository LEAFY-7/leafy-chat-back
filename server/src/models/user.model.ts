import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    email: {
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
