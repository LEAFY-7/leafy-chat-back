import mongoose, { Model, Schema } from "mongoose";
import ChatMessageDto from "../../dto/chat/message.dto";
import ModelKeyConfig from "../../configs/modelKey.config";
import modelOptions from "../../configs/model.config";

interface IChatMessageModel extends Model<ChatMessageDto & Document> {}

const messageSchema = new mongoose.Schema<ChatMessageDto>(
  {
    chatRoom: {
      type: Schema.Types.ObjectId,
      ref: ModelKeyConfig.chatRoom,
      required: true,
    },
    sender: {
      type: Number,
      ref: ModelKeyConfig.user,
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

class MessageSchema {
  getModel(): IChatMessageModel {
    return mongoose.model<ChatMessageDto, IChatMessageModel>(
      ModelKeyConfig.chatMessage,
      messageSchema
    );
  }
}

const chatMessageModel = new MessageSchema();
export default chatMessageModel.getModel();
