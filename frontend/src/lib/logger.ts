import { client } from './http/client';
import { routes } from './http/routes';

// TODO настройки dev prod для логирования
// TODO обработка ошибок
const method = (level: string, message: string) => {
  client.post(routes.loggerPath(), { level: level, message: message });
}

const middleware = (level: string, message: any) => method(level, message as string);

export const logger = {
  error: (message: any) => middleware('error', message),
  warn: (message: any) => middleware('warn', message),
  info: (message: any) => middleware('info', message),
  http: (message: any) => middleware('http', message),
  verbose: (message: any) => middleware('verbose', message),
  debug: (message: any) => middleware('debug', message),
  silly: (message: any) => middleware('silly', message)
}
