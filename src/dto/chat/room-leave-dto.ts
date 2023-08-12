import { Schema } from "mongoose";

export default class LeaveStatus {
  _id: number;
  lastLog: Schema.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    _id: number,
    lastLog: Schema.Types.ObjectId,
    updatedAt: Date,
    createdAt: Date
  ) {
    this._id = _id;
    this.lastLog = lastLog;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
