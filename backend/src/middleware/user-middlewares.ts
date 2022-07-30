import httpContext from 'express-http-context';
import { logger } from '../lib/logger';

export function loggingBefore(request: any, response: any, next?: (err?: any) => any): any {
  logger.silly('do something Before...');
  httpContext.set('traceId', 123);
  logger.silly('set traceId to 123');
  next?.();
}

export function loggingAfter(request: any, response: any, next?: (err?: any) => any): any {
  logger.silly('do something After...');
  logger.silly(`traceId = ${httpContext.get('traceId')}`);
  next?.();
}
