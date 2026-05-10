import { cookies } from '#utils/cookies.js';
import { AppError } from '#utils/error.js';
import { jwttoken } from '#utils/jwt.js';
import { NextFunction, Request, Response } from 'express';

const getProfileMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = cookies.get(req, 'token');
  if (!token) {
    throw new AppError('No token found in cookies', 401);
  }
  const decoded = jwttoken.verify(token);
  req.user = decoded;

  next();
};

export default getProfileMiddleware;
