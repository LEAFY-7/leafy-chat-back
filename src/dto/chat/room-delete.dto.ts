export default class DeleteStatus {
  _id: number;
  isDeleted: boolean;
  updatedAt: Date;
  createdAt: Date;

  constructor(
    _id: number,
    isDeleted: boolean,
    updatedAt: Date,
    createdAt: Date
  ) {
    this._id = _id;
    this.isDeleted = isDeleted;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
