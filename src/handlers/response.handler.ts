import { Response } from "express";
import responseConfigs from "../configs/response-message.config";

const responseWithData = (res: Response, statusCode: number, data: any) =>
  res.status(statusCode).json(data);

const error = (res: Response) =>
  responseWithData(res, 500, responseConfigs.responseMessages.dbError);

const badRequest = (res: Response, message: string) =>
  responseWithData(res, 400, {
    status: 400,
    message,
  });

const ok = (res: Response, data: any) => responseWithData(res, 200, data);

const created = (res: Response, data: any) => responseWithData(res, 201, data);

const unauthorize = (res: Response, message?: string) =>
  responseWithData(
    res,
    401,
    message
      ? { status: 401, message }
      : responseConfigs.responseMessages.unauthorized
  );

const notFound = (res: Response, message?: string) =>
  responseWithData(
    res,
    404,
    message
      ? { status: 404, message }
      : responseConfigs.responseMessages.notFound
  );

export default {
  error,
  badRequest,
  ok,
  created,
  unauthorize,
  notFound,
};
