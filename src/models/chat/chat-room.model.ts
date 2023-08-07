import mongoose, { Model } from "mongoose";
import setDefaultDates from "../../middlewares/room-date.mddileware";
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
  isLeaved: {
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
    hostLeavedStatus: leaveStatusSchema,
    memberLeavedStatus: leaveStatusSchema,
  },
  modelOptions
);

// 모델 미들웨어
chatRoomSchema.pre("save", setDefaultDates);

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
