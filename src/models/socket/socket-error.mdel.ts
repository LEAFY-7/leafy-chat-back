import EventModel from "./socket-event.model";

export default class NotifyErrorModel {
  public event: EventModel = EventModel.ERROR;
  public error: any = null;
  public to: string = "";
}
