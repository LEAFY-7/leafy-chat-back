import mongoose, { Model, Schema } from "mongoose";
import chatRoomDefaultMiddleware from "../../middlewares/room-default.middleware";
import ChatRoomDto from "../../dto/chat/room.dto";
import modelOptions from "../../configs/model-options.config";
import modelKeyConfig from "../../configs/model-key.config";

interface IChatRoomModel extends Model<ChatRoomDto & Document> {}

const leaveStatusSchema = new mongoose.Schema({
  _id: {
    type: Number,
    ref: modelKeyConfig.user,
    required: true,
  },
  lastLog: {
    type: Schema.Types.ObjectId,
    ref: modelKeyConfig.chatMessage,
    required: false,
    default: null,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const deletedStatusSchema = new mongoose.Schema({
  _id: {
    type: Number,
    ref: modelKeyConfig.user,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const chatRoomSchema = new mongoose.Schema<ChatRoomDto>(
  {
    _id: {
      type: String,
      required: true,
    },

    host: {
      type: Number,
      ref: modelKeyConfig.user,
      required: true,
    },
    member: {
      type: Number,
      ref: modelKeyConfig.user,
      required: true,
    },
    hostDeletedStatus: deletedStatusSchema,
    memberDeletedStatus: deletedStatusSchema,
    hostLeaveStatus: leaveStatusSchema,
    memberLeaveStatus: leaveStatusSchema,
  },
  modelOptions
);

// 채팅방 모델 기본 미들웨어
chatRoomSchema.pre("save", chatRoomDefaultMiddleware.setDefaultDelete);
chatRoomSchema.pre("save", chatRoomDefaultMiddleware.setDefaultLeave);

class ChatRoomModel {
  private model: IChatRoomModel;

  constructor() {
    this.model = mongoose.model<ChatRoomDto, IChatRoomModel>(
      modelKeyConfig.chatRoom,
      chatRoomSchema
    );
  }

  getModel(): IChatRoomModel {
    return this.model;
  }
}

const ChatRoom = new ChatRoomModel().getModel();
export default ChatRoom;
