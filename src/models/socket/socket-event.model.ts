enum EventModel {
  JOIN = "join",
  // 채팅방
  SEND = "send",
  MESSAGE_HISTORY = "message-history",
  RECEIVE_MESSAGE = "receive-message",

  // 연결
  DISCONNECT = "disconnect",
  ROOM_DISCONNECT = "room-disconnect",

  // 에러
  ERROR = "error",
  JOIN_ERROR = "joinError",
  CONNECT_ERROR = "connect-error",

  // 유저
  GET_USER = "get-user",
  SEND_USER = "send-user",
  RECEIVE_USER = "receive-user",
  ENTER_ROOM = "enter-room",
  ENTER_RECEIVE_ROOM = "enterReceiveRoom",
}
export default EventModel;
