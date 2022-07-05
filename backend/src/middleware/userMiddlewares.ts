import httpContext from 'express-http-context';
import { getLogger } from '../helper/logger';

export function loggingBefore(request: any, response: any, next?: (err?: any) => any): any {
  getLogger().silly('do something Before...');
  httpContext.set('traceId', 123);
  getLogger().silly('set traceId to 123');
  next?.();
}

export function loggingAfter(request: any, response: any, next?: (err?: any) => any): any {
  getLogger().silly('do something After...');
  getLogger().silly(`traceId = ${httpContext.get('traceId')}`);
  next?.();
}
