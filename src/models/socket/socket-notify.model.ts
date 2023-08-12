import EventModel from "./socket-event.model";

class NotifyToChatModel {
  public event: EventModel = EventModel.JOIN;
  public data: any[] | any = [];
  public to: string = "";
}
export default NotifyToChatModel;
