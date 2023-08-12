import { Document } from "mongoose";

export default class ChatMessageDto extends Document {
  chatRoom: string;
  sender: number;
  text: string;
  isRead: boolean;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    chatRoom: string,
    sender: number,
    text: string,
    isRead: boolean,
    updatedAt: Date,
    createdAt: Date
  ) {
    super();
    this.chatRoom = chatRoom;
    this.sender = sender;
    this.text = text;
    this.isRead = isRead;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
