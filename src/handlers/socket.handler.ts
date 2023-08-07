import { Socket } from "socket.io";
import errorMessagesConfig from "../configs/errorMessages.config";

type ErrorEvent = "error";

const socketError = (event: ErrorEvent = "error", socket: Socket) => {
  console.error("Socket Error:", {
    message: errorMessagesConfig.socket.notFoundRoom,
  });
  socket.emit(event, { message: errorMessagesConfig.socket.notFoundRoom });
};
export default {
  socketError,
};
