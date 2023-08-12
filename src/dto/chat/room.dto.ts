import { Document } from "mongoose";
import DeleteStatus from "./room-delete.dto";
import LeaveStatus from "./room-leave-dto";

export default class ChatRoomDto extends Document {
  _id: string;
  host: number;
  member: number;
  updatedAt: Date;
  createdAt: Date;
  hostDeletedStatus: DeleteStatus;
  memberDeletedStatus: DeleteStatus;
  hostLeaveStatus: LeaveStatus;
  memberLeaveStatus: LeaveStatus;

  constructor(
    _id: string,
    host: number,
    member: number,
    updatedAt: Date,
    createdAt: Date,
    hostDeletedStatus: DeleteStatus,
    memberDeletedStatus: DeleteStatus,
    hostLeaveStatus: LeaveStatus,
    memberLeaveStatus: LeaveStatus
  ) {
    super();
    this._id = _id;
    this.host = host;
    this.member = member;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.hostDeletedStatus = hostDeletedStatus;
    this.memberDeletedStatus = memberDeletedStatus;
    this.hostLeaveStatus = hostLeaveStatus;
    this.memberLeaveStatus = memberLeaveStatus;
  }
}
