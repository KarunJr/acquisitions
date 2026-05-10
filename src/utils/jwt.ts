import logger from '#config/logger.js';
import jwt from 'jsonwebtoken';

interface IPayload {
  id: number;
  email: string;
  role: string;
}
export type DecodedToken = jwt.JwtPayload & IPayload
const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-please-change-in-production';
const JWT_EXPIRES = '1d';

export const jwttoken = {
  sign: (payload: IPayload): string => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    } catch (error) {
      logger.error('JWT Signing Failed', { error });
      throw new Error('Internal server error during token generation', {
        cause: error,
      });
    }
  },

  verify: (token: string): DecodedToken => {
    try {
      return jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error: unknown) {
      logger.error('JWT Verification Failed', { error });

      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired', { cause: error });
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token signature or format', { cause: error });
      }
      throw new Error('Authentication failed', { cause: error });
    }
  },
};
