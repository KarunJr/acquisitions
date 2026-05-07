import { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;
export const cleanAsync = (fn: AsyncController): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
