export class SocketConfigs {
  public join = "join";
  public send = "send";
  public messageHistory = "messageHistory";
  public receiveMessage = "receiveMessage";
  public disconnect = "disconnect";
  public roomDisconnect = "roomDisconnect";
  public error = "error";
}
const socketConfigs = new SocketConfigs();
export default socketConfigs;

// enum EventModel {
//   JOIN = "join",
//   SEND = "send",
//   MESSAGE_HISTORY = "messageHistory",
//   RECEIVE_MESSAGE = "receiveMessage",
//   DISCONNECT = "disconnect",
//   ROOM_DISCONNECT = "roomDisconnect",
//   ERROR = "error",
// }
// export default EventModel;
