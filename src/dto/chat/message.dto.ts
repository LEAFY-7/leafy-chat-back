import { Document, Schema } from "mongoose";

export default class ChatMessageDto extends Document {
  chatRoom: Schema.Types.ObjectId;
  sender: number;
  text: string;
  isRead: boolean;

  constructor(
    chatRoom: Schema.Types.ObjectId,
    sender: number,
    text: string,
    isRead: boolean
  ) {
    super();
    this.chatRoom = chatRoom;
    this.sender = sender;
    this.text = text;
    this.isRead = isRead;
  }
}
