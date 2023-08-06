import { Document } from "mongoose";
import LeaveStatus from "./leave.dto";

export default class ChatRoomDto extends Document {
  _id: string;
  user: number;
  host: number;
  member: number;
  hostLeavedStatus: LeaveStatus;
  memberLeavedStatus: LeaveStatus;

  constructor(
    _id: string,
    user: number,
    host: number,
    member: number,
    hostLeavedStatus: LeaveStatus,
    memberLeavedStatus: LeaveStatus
  ) {
    super();
    this._id = _id;
    this.user = user;
    this.host = host;
    this.member = member;
    this.hostLeavedStatus = hostLeavedStatus;
    this.memberLeavedStatus = memberLeavedStatus;
  }
}