import { Socket } from "socket.io";
import errorMessagesConfig from "../configs/error-messages.config";

type ErrorEvent = "error" | "unauthorize";

const socketError = (event: ErrorEvent = "error", socket: Socket) => {
  console.error("소켓 에러 :", {
    message: errorMessagesConfig.socket.notFoundRoom,
  });
  socket.emit(event, { message: errorMessagesConfig.socket.notFoundRoom });
};

const unauthorize = (event: ErrorEvent = "unauthorize", socket: Socket) => {
  console.error("소켓 에러 :", {
    message: errorMessagesConfig.socket.unauthorizedRoom,
  });

  socket.emit(event, { message: errorMessagesConfig.socket.unauthorizedRoom });
};
export default {
  socketError,
  unauthorize,
};
