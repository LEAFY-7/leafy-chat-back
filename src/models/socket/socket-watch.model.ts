import EventModel from "./socket-event.model";

export default class WatchEventModel {
  public event: EventModel = EventModel.JOIN;
  public listener: (...args: any[] | any) => void = () => {};
}
