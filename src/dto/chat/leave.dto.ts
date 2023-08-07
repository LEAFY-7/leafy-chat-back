export default class LeaveStatus {
  userId: number;
  isLeaved: boolean;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    userId: number,
    isLeaved: boolean,
    updatedAt: Date,
    createdAt: Date
  ) {
    this.userId = userId;
    this.isLeaved = isLeaved;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
