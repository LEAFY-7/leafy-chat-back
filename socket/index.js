import { Server } from "socket.io";
import "dotenv/config";

const { SERVER_URL, PORT } = process.env;

const io = new Server(PORT, {
  cors: {
    origin: SERVER_URL,
    credentials: true,
  },
});

const chatSpace = io.of("/chat"); // 네임스페이스 등록

chatSpace.on("connection", (socket) => {
  console.log("connected");
  const { watchJoin, watchSend, watchByebye } = initSocket(socket);
  watchJoin();
  watchSend();
  watchByebye();
});

const initSocket = (socket) => {
  console.log("새로운 소켓이 연결되었습니다.");
  function watchEvent(event, func) {
    socket.on(event, func);
  }

  function notifyToChat(event, data) {
    console.log("chatSpace 데이터를 emit합니다.");
    chatSpace.emit(event, data);
  }

  return {
    watchJoin: () => {
      watchEvent("join", async (data) => {});
    },
  };
};
