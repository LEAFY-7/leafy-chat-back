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
  GLOBAL = "global",
  SEND_GLOBAL = "sendChatList",
  RECEIVE_GLOBAL = "receiveChatList",
}
export default EventModel;
