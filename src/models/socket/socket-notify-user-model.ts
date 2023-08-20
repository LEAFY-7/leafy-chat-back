import EventModel from "./socket-event.model";

export default class NotifyToChatModel {
  public event: EventModel = EventModel.JOIN;
  public data: any[] | any = [];
  public to: number = 0;
}
