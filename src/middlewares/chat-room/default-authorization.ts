function setAuthorization(this: any) {
  this.hostLeavedStatus.userId = this.host;
  this.memberLeavedStatus.userId = this.member;
}

export default setAuthorization;
