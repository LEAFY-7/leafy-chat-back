import mongoose, { Model } from "mongoose";
import ChatRoomDto from "../../dto/chat/room.dto";
import modelOptions from "../../configs/model.config";
import ModelKeyConfig from "../../configs/modelKey.config";
import LeaveStatus from "../../dto/chat/leave.dto";

interface IChatRoomModel extends Model<ChatRoomDto & Document> {}

const leaveStatusSchema = new mongoose.Schema<LeaveStatus>({
  userId: {
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
    user: {
      type: Number,
      ref: ModelKeyConfig.user,
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

class ChatRoomSchema {
  getModel(): IChatRoomModel {
    return mongoose.model<ChatRoomDto, IChatRoomModel>(
      ModelKeyConfig.chatRoom,
      chatRoomSchema
    );
  }
}

const chatRoomModel = new ChatRoomSchema();
export default chatRoomModel.getModel();
