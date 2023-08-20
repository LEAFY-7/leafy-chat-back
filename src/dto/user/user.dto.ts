import { Document, Schema } from "mongoose";

export default class UserDto extends Document {
  _id: number;
  nickName: string;
  email: string;
  profileImage?: string;
  chatRoom: string[];

  constructor(
    _id: number,
    nickName: string,
    email: string,
    chatRoom: string[],
    profileImage?: string
  ) {
    super();
    this._id = _id;
    this.nickName = nickName;
    this.email = email;
    this.chatRoom = chatRoom;
    this.profileImage = profileImage;
  }
}
