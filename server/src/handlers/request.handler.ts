import * as express from "express";
import { validationResult } from "express-validator";

const validate = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res.status(400).json({
      message: error.array()[0].msg,
    });
  next();
};

export default { validate };
