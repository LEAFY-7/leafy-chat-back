/**
 * @description 채팅방 모델 미들웨어 - 초기 Leave의 상태 정의
 * @param this ChatRoom
 */
function setDefaultLeave(this: any) {
  const date = new Date();
  if (this.hostLeaveStatus.createdAt && this.memberLeaveStatus.createdAt) {
    this.hostLeaveStatus.updatedAt = date;
    this.memberLeaveStatus.updatedAt = date;
  } else {
    this.hostLeaveStatus.lastLog = null;
    this.hostLeaveStatus.updatedAt = date;
    this.hostLeaveStatus.createdAt = date;

    this.memberLeaveStatus.lastLog = null;
    this.memberLeaveStatus.updatedAt = date;
    this.memberLeaveStatus.createdAt = date;
  }
}
/**
 * @description 채팅방 모델 미들웨어 - 초기 delete의 상태 정의
 * @param this ChatRoom
 */
function setDefaultDelete(this: any) {
  const date = new Date();
  if (this.hostDeletedStatus.createdAt && this.memberDeletedStatus.createdAt) {
    this.hostDeletedStatus.updatedAt = date;
    this.memberDeletedStatus.updatedAt = date;
  } else {
    this.hostDeletedStatus.updatedAt = date;
    this.hostDeletedStatus.createdAt = date;

    this.memberDeletedStatus.updatedAt = date;
    this.memberDeletedStatus.createdAt = date;
  }
}
function setDeleteStatueSetting(this: any) {
  const date = new Date();
  if (this.hostDeletedStatus.isDeleted && this.memberDeletedStatus.isDeleted) {
    this.hostDeletedStatus.updatedAt = date;
    this.memberDeletedStatus.updatedAt = date;
  } else {
    this.hostDeletedStatus.updatedAt = date;
    this.hostDeletedStatus.createdAt = date;

    this.memberDeletedStatus.updatedAt = date;
    this.memberDeletedStatus.createdAt = date;
  }
}

export default { setDefaultLeave, setDefaultDelete, setDeleteStatueSetting };
