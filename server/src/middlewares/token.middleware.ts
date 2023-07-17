import jsonwebtoken from "jsonwebtoken";
import * as express from "express";

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
  res: express.Request,
  next: express.NextFunction
) => {
  const decodedToken = tokenDecode(req);
  if (!decodedToken) {
    // 인증안될때 handler
    return;
  }

  // 모델c:\Users\태권\leafy-front-2\.github
  next();
};

export default { auth, tokenDecode };
