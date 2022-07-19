import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { getLogger } from '../helper/logger';

@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: () => any) {
    getLogger().silly(`GlobalErrorHandler: ${error}, errors: ${error.errors}`);
    response.status((error.statusCode || error.httpCode) ?? 418).json(error);
    next();
  }
}
