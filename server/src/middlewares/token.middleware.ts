import { RequestHandler, Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import responseHandler from "../handlers/response.handler";
import "dotenv/config";
import userModel from "../models/user.model";
import { CustomRequest } from "../types/request.type";

const tokenDecode = (req: Request) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];
      if (token) return true;
      return false;
    }
    return false;
  } catch {
    return false;
  }
};

export const auth: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { userId },
  } = req;
  const decodedToken = tokenDecode(req);
  if (!decodedToken) return responseHandler.unauthorize(res);

  const user = await userModel.findById(userId);
  if (!user) return responseHandler.unauthorize(res);
  (req as CustomRequest).user = user;
  next();
};

export default { auth, tokenDecode };
