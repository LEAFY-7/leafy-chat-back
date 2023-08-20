enum EventModel {
  JOIN = "join",
  SEND = "send",
  MESSAGE_HISTORY = "messageHistory",
  RECEIVE_MESSAGE = "receiveMessage",
  DISCONNECT = "disconnect",
  ROOM_DISCONNECT = "roomDisconnect",
  ERROR = "error",
  JOIN_ERROR = "joinError",
  CONNECT_ERROR = "connect_error",

  // 유저
  GET_USER = "get-user",
  SEND_USER = "send-user",
  RECEIVE_USER = "receive-user",
  ENTER_ROOM = "enterRoom",
  ENTER_RECEIVE_ROOM = "enterReceiveRoom",
}
export default EventModel;
