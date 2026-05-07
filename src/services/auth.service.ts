import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { AppError } from '#utils/error.js';
import { SigninInput, SignupInput } from '#validations/auth.validation.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error: unknown) {
    logger.error('Error hashing the passwords', error);
    throw new Error('Error hashing the password', {
      cause: error,
    });
  }
};

export const comparePassword = async (
  password: string,
  hash_password: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash_password);
  } catch (error: unknown) {
    logger.error('Error comparing the passwords', error);
    throw new Error('Error comparing the password', {
      cause: error,
    });
  }
};

export const createUser = async ({
  name,
  email,
  password,
  role,
}: SignupInput) => {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) throw new AppError('User already exists', 400);

  const password_hash = await hashPassword(password);

  const [newUser] = await db
    .insert(users)
    .values({ name, email, password: password_hash, role })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      created_at: users.created_at,
    });
  return newUser;
};

export const authenticateUser = async ({ email, password }: SigninInput) => {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!existingUser) {
    throw new AppError('User not found', 404);
  }

  const isValidPassword = await comparePassword(
    password,
    existingUser.password
  );
  if (!isValidPassword) {
    throw new AppError('Invalid password', 401);
  }
  return {
    id: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
    created_at: existingUser.created_at,
  };
};

// export const createUser = async ({
//   name,
//   email,
//   password,
//   role,
// }: SignupInput) => {
//   try {
//     const existingUser = await db
//       .select()
//       .from(users)
//       .where(eq(users.email, email))
//       .limit(1);

//     if (existingUser.length > 0) throw new Error('User already exists');

//     const password_hash = await hashPassword(password);

//     const [newUser] = await db
//       .insert(users)
//       .values({ name, email, password: password_hash, role })
//       .returning({
//         id: users.id,
//         name: users.name,
//         email: users.email,
//         role: users.role,
//         created_at: users.created_at,
//       });
//     return newUser;
//   } catch (error) {
//     logger.error('Error creating the user', error);
//     throw new Error('Error creating the user', {
//       cause: error,
//     });
//   }
// };

// export const authenticateUser = async ({ email, password }: SigninInput) => {
//   try {
//     console.log('Hello');
//     const [existingUser] = await db
//       .select()
//       .from(users)
//       .where(eq(users.email, email));

//     if (!existingUser) {
//       throw new Error('User not found');
//     }

//     const isValidPassword = await comparePassword(
//       password,
//       existingUser.password
//     );
//     if (!isValidPassword) {
//       throw new Error('Invalid password');
//     }
//     return {
//       id: existingUser.id,
//       email: existingUser.email,
//       role: existingUser.role,
//       created_at: existingUser.created_at,
//     };
//   } catch (error) {
//     logger.error('Error signing the user', error);
//     throw new Error('Error signing the user', {
//       cause: error,
//     });
//   }
// };
