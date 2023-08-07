function setDefaultDates(this: any) {
  const date = new Date();
  if (this.hostLeavedStatus.createdAt && this.memberLeavedStatus.createdAt) {
    this.hostLeavedStatus.updatedAt = date;
    this.memberLeavedStatus.updatedAt = date;
  } else {
    this.hostLeavedStatus.updatedAt = date;
    this.hostLeavedStatus.createdAt = date;

    this.memberLeavedStatus.updatedAt = date;
    this.memberLeavedStatus.createdAt = date;
  }
}
export default setDefaultDates;
