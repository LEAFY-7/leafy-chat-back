import { Server } from "socket.io";
import server from "./index";
import "dotenv/config";

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000/",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("연결되었습니다.");

  socket.on("disconnect", () => {
    console.log("연결이 취소되었습니다.");
  });
});

// const chatSpace = io.of("/chat"); // 네임스페이스 등록

// chatSpace.on("connection", (socket) => {
//   console.log("connected");
//   const { watchJoin, watchSend, watchByebye } = initSocket(socket);
//   watchJoin();
//   watchSend();
//   watchByebye();
// });

// const initSocket = (socket) => {
//   console.log("새로운 소켓이 연결되었습니다.");
//   function watchEvent(event, func) {
//     socket.on(event, func);
//   }

//   function notifyToChat(event, data) {
//     console.log("chatSpace 데이터를 emit합니다.");
//     chatSpace.emit(event, data);
//   }

//   return {
//     watchJoin: () => {
//       watchEvent("join", async (data) => {});
//     },
//   };
// };
