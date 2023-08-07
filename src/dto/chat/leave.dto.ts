export default class LeaveStatus {
  _id: number;
  isLeaved: boolean;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    _id: number,
    isLeaved: boolean,
    updatedAt: Date,
    createdAt: Date
  ) {
    this._id = _id;
    this.isLeaved = isLeaved;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
