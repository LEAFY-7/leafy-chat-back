import mongoose, { Model } from "mongoose";
import ChatRoomDto from "../../dto/chat/room.dto";
import ModelKeyConfig from "../../configs/modelKey.config";
import modelOptions from "../../configs/model.config";
import setDefaultDates from "../../middlewares/room-date.mddileware";

interface IChatRoomModel extends Model<ChatRoomDto & Document> {}

const leaveStatusSchema = new mongoose.Schema({
  _id: {
    type: Number,
    ref: ModelKeyConfig.user,
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
      ref: ModelKeyConfig.user,
      required: true,
    },
    member: {
      type: Number,
      ref: ModelKeyConfig.user,
      required: true,
    },
    hostLeavedStatus: leaveStatusSchema,
    memberLeavedStatus: leaveStatusSchema,
  },
  modelOptions
);

// 모델 미들웨어
chatRoomSchema.pre("save", setDefaultDates);

class ChatRoomSchema {
  private model: IChatRoomModel;

  constructor() {
    this.model = mongoose.model<ChatRoomDto, IChatRoomModel>(
      ModelKeyConfig.chatRoom,
      chatRoomSchema
    );
  }

  getModel(): IChatRoomModel {
    return this.model;
  }
}

const chatRoomModel = new ChatRoomSchema();
export default chatRoomModel.getModel();
