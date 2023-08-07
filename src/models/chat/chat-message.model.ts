import mongoose, { Model, Schema } from "mongoose";
import ChatMessageDto from "../../dto/chat/message.dto";
import modelKeyConfig from "../../configs/model-key.config";
import modelOptions from "../../configs/model-options.config";

interface IChatMessageModel extends Model<ChatMessageDto & Document> {}

const messageSchema = new mongoose.Schema<ChatMessageDto>(
  {
    chatRoom: {
      type: Schema.Types.ObjectId,
      ref: modelKeyConfig.chatRoom,
      required: true,
    },
    sender: {
      type: Number,
      ref: modelKeyConfig.user,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  modelOptions
);

class ChatMessageModel {
  private model: IChatMessageModel;

  constructor() {
    this.model = mongoose.model<ChatMessageDto, IChatMessageModel>(
      modelKeyConfig.chatMessage,
      messageSchema
    );
  }

  getModel(): IChatMessageModel {
    return this.model;
  }
}

const ChatMessage = new ChatMessageModel().getModel();
export default ChatMessage;
