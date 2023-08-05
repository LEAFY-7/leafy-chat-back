import { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  _id: number;
  nickName: string;
  email: string;
  imgUrl?: string;
  chatRoom: Schema.Types.ObjectId[];
}

export interface IUserModel extends Model<IUser> {}
