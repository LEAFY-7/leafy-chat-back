import { Event } from "./socket-event.model";

export class NotifyToChatModel {
  public event: Event = "join";
  public data: any[] | any = [];
  public to: string = "";
}
