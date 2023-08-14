import { Request } from "express";

export interface CustomRequest extends Request {
  user: {
    id: number;
  };
  room: {
    me: number;
    you: number;
  };
}
