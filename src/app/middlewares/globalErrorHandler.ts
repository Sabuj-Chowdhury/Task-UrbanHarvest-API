import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorhandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  res.status(statusCode).send({
    success,
    message,
    error,
  });
};

export default globalErrorhandler;
