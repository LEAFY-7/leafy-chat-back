import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import mongoose, { ConnectOptions } from "mongoose";
import "dotenv/config";
import routes from "./routes";

const { CONNECTION } = process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/v1", routes);

mongoose
  .connect(CONNECTION!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log("mongoDB와 연결되었습니다.");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

const server = http.createServer(app);

export default server;
