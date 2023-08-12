import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import SocketConfigs from "../configs/socket.config";

export type SocketType = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

export type Event =
  | "join"
  | "send"
  | "messageHistory"
  | "receiveMessage"
  | "disconnect"
  | "roomDisconnect";

export type EventEnum = {
  JOIN: "join";
  SEND: "send";
};

// keyof typeof socketConfigs
export interface InitSocket {
  event: Event;
  listener: (...args: any[] | any) => void;
}
export interface NotifyToChat {
  event: Event;
  data: any[] | any;
  to: string;
}
