import { Event } from "./socket-event.model";

export class WatchEventModel {
  public event: Event = "join";
  public listener: (...args: any[] | any) => void = () => {};
}
