import * as express from "express";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler";

const tokenDecode = (req: express.Request) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];
      return jsonwebtoken.verify(token, process.env.TOKEN_SECRET!);
    }
    return false;
  } catch {
    return false;
  }
};

const auth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const decodedToken = tokenDecode(req);
  if (!decodedToken) return responseHandler.unauthorize(res);

  // 모델

  next();
};

export default { auth, tokenDecode };
