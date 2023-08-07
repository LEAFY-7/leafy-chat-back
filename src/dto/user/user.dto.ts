import { Document, Schema } from "mongoose";

export default class UserDto extends Document {
  _id: number;
  nickName: string;
  email: string;
  imgUrl?: string;
  chatRoom: Schema.Types.ObjectId[];

  constructor(
    _id: number,
    nickName: string,
    email: string,
    chatRoom: Schema.Types.ObjectId[],
    imgUrl?: string
  ) {
    super();
    this._id = _id;
    this.nickName = nickName;
    this.email = email;
    this.chatRoom = chatRoom;
    this.imgUrl = imgUrl;
  }
}
