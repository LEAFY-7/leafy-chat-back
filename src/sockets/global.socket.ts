import { globalSpace } from "./server.socket";

import SocketModel from "../models/socket/socket.model";
import EventModel from "../models/socket/socket-event.model";

const globalSocket = (socket: SocketModel["socket"]) => {
  console.log("소켓이 연결되었습니다.");

  function watchEvent({ event, listener }: SocketModel["watchEvent"]) {
    socket.on(event, listener);
  }

  function notifyToChat({ event, data, to }: SocketModel["notifyToChat"]) {
    console.log(`${event}에 대해서 ${data}를 emit합니다.`);
    globalSpace.to(to).emit(event, data);
  }

  return {
    watchJoin: () => {
      watchEvent({
        event: EventModel.JOIN, // 글로벌
        listener: async (data) => {
          console.log(data);
        },
      });
    },
  };
};
export default globalSocket;
