import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { logger } from '../lib/logger';
import { getSessionId } from '../lib/getSessionId';

@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: () => any) {
    const sessionId = getSessionId(request);
    logger.silly(`GlobalErrorHandler: ${error}, errors: ${error.errors}`, { sessionId });
    response.status((error.statusCode || error.httpCode) ?? 418).json(error);
    next();
  }
}
