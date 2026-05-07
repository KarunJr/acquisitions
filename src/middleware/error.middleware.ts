import logger from '#config/logger.js';
import { AppError } from '#utils/error.js';
import { NextFunction, Request, Response } from 'express';

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode: number = 500;
  let message: string = 'Something went wrong';
  let stack: string | undefined = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
    stack = err.stack;
  }

  logger.error(`Error: ${message}`, {
    stack: stack || (err as Error).stack,
    path: req.originalUrl,
  });
  return res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack,
      originalError: err,
    }),
  });
};
