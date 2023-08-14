import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import EventModel from "./socket-event.model";
import WatchEventModel from "./socket-watch.model";
import NotifyToChatModel from "./socket-notify.model";
import NotifyErrorModel from "./socket-error.mdel";

type SocketType = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

export default class SocketModel {
  public socket: SocketType;
  public event: EventModel;
  public watchEvent: WatchEventModel = new WatchEventModel();
  public notifyToChat: NotifyToChatModel = new NotifyToChatModel();
  public notifyError: NotifyErrorModel = new NotifyErrorModel();

  constructor(socket: SocketType, event: EventModel) {
    this.socket = socket;
    this.event = event;
  }
}
