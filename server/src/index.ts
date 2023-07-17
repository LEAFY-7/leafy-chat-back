import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import mongoose, { ConnectOptions } from "mongoose";
import "dotenv/config";
import routes from "./routes";

const { PORT, CONNECTION } = process.env;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("chat/api/v1", routes);

const port = PORT || 8000;
const server = http.createServer(app);

mongoose
  .connect(CONNECTION!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log("mongo db와 연결되었습니다.");
    server.listen(port, () => {
      console.log(`서버 포트는 ${port} 에서 작동중입니다.`);
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
