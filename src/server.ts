import http from "./app";
import "dotenv/config";
require("./sockets/server");

const { PORT } = process.env;
const port = PORT || 5000;

http.listen(port, () => {
  console.log(`서버 포트는 ${port} 에서 작동중입니다.`);
});
