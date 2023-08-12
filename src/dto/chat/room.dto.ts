import { Document } from "mongoose";
import LeaveStatus from "./leave.dto";

export default class ChatRoomDto extends Document {
  _id: string;
  host: number;
  member: number;
  hostLeavedStatus: LeaveStatus;
  memberLeavedStatus: LeaveStatus;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    _id: string,
    host: number,
    member: number,
    hostLeavedStatus: LeaveStatus,
    memberLeavedStatus: LeaveStatus,
    updatedAt: Date,
    createdAt: Date
  ) {
    super();
    this._id = _id;
    this.host = host;
    this.member = member;
    this.hostLeavedStatus = hostLeavedStatus;
    this.memberLeavedStatus = memberLeavedStatus;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
