import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import EventModel from "./socket-event.model";
import WatchEventModel from "./socket-watch.model";
import NotifyToChatModel from "./socket-notify.model";

type SocketType = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

class SocketModel {
  public socket: SocketType;
  public event: EventModel;
  public watchEvent: WatchEventModel;
  public notifyToChat: NotifyToChatModel;

  constructor(
    socket: SocketType,
    event: EventModel,
    watchEvent: WatchEventModel,
    notifyToChat: NotifyToChatModel
  ) {
    this.socket = socket;
    this.event = event;
    this.watchEvent = watchEvent;
    this.notifyToChat = notifyToChat;
  }
}

export default SocketModel;
