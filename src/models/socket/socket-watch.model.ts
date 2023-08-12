import EventModel from "./socket-event.model";

class WatchEventModel {
  public event: EventModel = EventModel.JOIN;
  public listener: (...args: any[] | any) => void = () => {};
}
export default WatchEventModel;
