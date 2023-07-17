import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import mongoose, { ConnectOptions } from "mongoose";
import "dotenv/config";

const { PORT, CONNECTION } = process.env;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const port = PORT || 8000;
const server = http.createServer(app);

mongoose
  .connect(CONNECTION!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log("Successfully connected to mongodb");
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
