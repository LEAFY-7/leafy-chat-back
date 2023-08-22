class RouteConfigs {
  public api = "/api";
  public root = "/";
  public auth = "/auth";
  public chat = "/chat";
  public chatRoom = "/chat-room";
  public chatMessage = "/chat-message";
  public signup = "/signup";
  public updateUser = "/update-user";
  public clearUserChatRoom = "/clear/chat-room";
  public clearNoMessageChatRoom = "/clear/chat-room/none";
  public prev = "/prev";
  public next = "/next";
  public roomId = "/:roomId";
}
const routeConfigs = new RouteConfigs();
export default routeConfigs;
