import * as express from "express";

const responseWithData = (
  res: express.Response,
  statusCode: number,
  data: any
) => res.status(statusCode).json(data);

const error = (res: express.Response) =>
  responseWithData(res, 500, {
    status: 500,
    message: "DB에 응답을 요청하는 중 에러가 발생했습니다.",
  });

const badRequest = (res: express.Response, message: string) =>
  responseWithData(res, 400, {
    status: 400,
    message,
  });

const ok = (res: express.Response, data: any) =>
  responseWithData(res, 200, data);

const created = (res: express.Response, data: any) =>
  responseWithData(res, 201, data);

const unauthorize = (res: express.Response) =>
  responseWithData(res, 401, {
    status: 401,
    message: "인증이 되지 않았습니다.",
  });

const notFound = (res: express.Response) =>
  responseWithData(res, 404, {
    status: 404,
    message: "해당 리소스를 찾지 못했습니다.",
  });

export default {
  error,
  badRequest,
  ok,
  created,
  unauthorize,
  notFound,
};
