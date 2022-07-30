import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from 'jsonwebtoken';
import { AppError } from '../error/app-error';

export const authorizationChecker = async (action: any, roles: string[]) => {
  const token = action.request.headers.authorization.split(' ')[1];

  try {
    await jwt.verify(token, process.env.SECRET_KEY as string);
  } catch (error) {
    const errorName = error instanceof Error ? error.name : false;
    switch (errorName) {
      case 'TokenExpiredError':
        // TODO вставить это во фронтенд
        setTimeout(() => {
          throw new AppError({
            name: 'token-expired',
            statusCode: 401,
            errors: [error as TokenExpiredError],
          });
        });
        return false;
      case 'JsonWebTokenError':
        setTimeout(() => {
          throw new AppError({
            name: 'jwt-error',
            statusCode: 400,
            errors: [error as JsonWebTokenError],
          });
        });
        return false;
      case 'NotBeforeError':
        setTimeout(() => {
          throw new AppError({
            name: 'jwt-error',
            statusCode: 401,
            errors: [error as NotBeforeError],
          });
        });
        return false;
      default:
        setTimeout(() => {
          throw new AppError({
            name: 'unexpected-error',
            statusCode: 500,
            errors: [error as Error],
          });
        });
        return false;
    }
  }

  return true;
};
