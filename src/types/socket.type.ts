import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export type SocketType = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

export type Event = "join" | "send";

export type EventEnum = {
  JOIN: "join";
  SEND: "send";
};

export interface InitSocket {
  event: Event;
  listener: (...args: any[] | any) => void;
}
export interface NotifyToChat {
  event: Event;
  data: any[];
}
