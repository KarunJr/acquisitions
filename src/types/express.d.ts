import { type DecodedToken } from '#utils/jwt.ts';
export {};
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}
