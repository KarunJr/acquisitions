import logger from '#config/logger.js';
import { authenticateUser, createUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { AppError } from '#utils/error.js';
import { formatValidationError } from '#utils/format.js';
import { jwttoken } from '#utils/jwt.js';
import { signinSchema, signupSchema } from '#validations/auth.validation.js';
import { NextFunction, Request, Response } from 'express';

export const signup = async (req: Request, res: Response) => {
  const validationResult = signupSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new AppError(formatValidationError(validationResult.error), 400);
  }

  const user = await createUser(validationResult.data);

  const token = jwttoken.sign({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  cookies.set(res, 'token', token);

  logger.info(`User regsisterd successfully: ${user.email}`);
  return res.status(201).json({
    message: 'User registered',
    user,
  });
};

export const signin = async (req: Request, res: Response) => {
  const validationResult = signinSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new AppError(formatValidationError(validationResult.error), 400);
  }

  const user = await authenticateUser(validationResult.data);

  const token = jwttoken.sign({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  cookies.set(res, 'token', token);

  logger.info(`User authenticated successfully: ${user.email}`);
  return res.status(200).json({
    message: 'User signed in successfully',
    user,
  });
};

export const signout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    cookies.clear(res, 'token');
    logger.info('User signed out successfully');
    res.status(200).json({ message: 'User signed out successfully' });
  } catch (error) {
    logger.error('Signout error', error);
    next(error);
  }
};

// export const signup = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const validationResult = signupSchema.safeParse(req.body);
//     if (!validationResult.success) {
//       return res.status(400).json({
//         error: 'Validation failed',
//         details: formatValidationError(validationResult.error),
//       });
//     }

//     const user = await createUser(validationResult.data);

//     const token = jwttoken.sign({
//       id: user.id,
//       email: user.email,
//       role: user.role,
//     });

//     cookies.set(res, 'token', token);

//     logger.info(`User regsisterd successfully: ${user.email}`);
//     return res.status(201).json({
//       message: 'User registered',
//       user,
//     });
//   } catch (error: unknown) {
//     logger.error('Signup error', error);

//     if (
//       error instanceof Error &&
//       error.message === 'User with this email already exists'
//     ) {
//       return res.status(409).json({ error: 'Email already exist' });
//     }
//     next(error);
//   }
// };

// export const signin = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const validationResult = signinSchema.safeParse(req.body);
//     if (!validationResult.success) {
//       return res.status(400).json({
//         error: 'Validation failed',
//         details: formatValidationError(validationResult.error),
//       });
//     }

//     const user = await authenticateUser(validationResult.data);

//     const token = jwttoken.sign({
//       id: user.id,
//       email: user.email,
//       role: user.role,
//     });

//     cookies.set(res, 'token', token);

//     logger.info(`User authenticated successfully: ${user.email}`);
//     return res.status(200).json({
//       message: 'User signed in successfully',
//       user,
//     });
//   } catch (error) {
//     logger.error('Signin error', error);
//     if (
//       error instanceof Error &&
//       (error.message === 'User not found' ||
//         error.message === 'Invalid password')
//     ) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     next(error);
//   }
// };


