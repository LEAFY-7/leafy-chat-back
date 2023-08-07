function setDefaultDates(this: any) {
  this.hostLeavedStatus.updatedAt = new Date();
  this.hostLeavedStatus.createdAt = new Date();

  this.memberLeavedStatus.updatedAt = new Date();
  this.memberLeavedStatus.createdAt = new Date();
}
export default setDefaultDates;
