import winston, { Logger } from 'winston';
import path from 'path';
import fs from 'fs';
import config from 'config';
import 'winston-mongodb';
// eslint-disable-next-line import/no-cycle
import { DbConfig } from './database';

/**
 * levels:
 *   error: 0,
 *   warn: 1,
 *   info: 2,
 *   http: 3,
 *   verbose: 4,
 *   debug: 5,
 *   silly: 6
 */

let loggerInstance: Logger;

const logFilePath = path.join(__dirname, '../../logs/');

export const winstonConsoleTransport = new (winston.transports.Console)({
  level: config.get('LOG_LEVEL_CONSOLE'),
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({
      timestamp, meta, level, message,
    }) => `${timestamp} ${meta.sessionId} ${meta.side} ${level}: ${message}`),
  ),
});

export const winstonFileTransport = new (winston.transports.File)({
  level: config.get('LOG_LEVEL_FILE'),
  filename: path.join(logFilePath, 'log.log'),
  handleExceptions: true,
  maxsize: 5242880,
  maxFiles: 10,
  format: winston.format.combine(
    winston.format.uncolorize(),
    winston.format.timestamp(),
    winston.format.printf(({
      timestamp, meta, level, message,
    }) => `${timestamp} | ${meta.sessionId} | ${meta.side} | ${level} | ${message}`),
  ),
});

export const addMongoTransport = ({
  login, password, host, port, database,
}: DbConfig) => {
  const mongoTransport = new winston.transports.MongoDB({
    db: `mongodb://${login}:${password}@${host}:${port}/${database}?authSource=admin`,
    level: config.get('LOG_LEVEL_DB'),
    decolorize: true,
    metaKey: 'meta',
  });
  loggerInstance.add(mongoTransport);
};

export const createLogger = () => {
  try {
    fs.accessSync(logFilePath);
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      fs.mkdirSync(logFilePath, { recursive: true });
    }
  }

  loggerInstance = winston.createLogger({
    exitOnError: false,
    defaultMeta: {
      meta: {
        sessionId: 'no-session-id',
        side: 'backend',
      },
    },
    // format: winston.format.combine(
    //   winston.format.metadata(),
    // ),
  });

  loggerInstance.add(winstonConsoleTransport);
  loggerInstance.add(winstonFileTransport);

  return loggerInstance;
};

export const getLogger = () => {
  if (loggerInstance) {
    return loggerInstance;
  }
  return createLogger();
};

export const loggerMethod = (level: string, message: string, metaData: any, side: string) => {
  if (metaData) {
    getLogger().log(level, message, { meta: { ...metaData, side } });
  } else {
    getLogger().log(level, message);
  }
};

export const logger = {
  error: (message: string, metaData: any = undefined) => loggerMethod('error', message, metaData, 'backend'),
  warn: (message: string, metaData: any = undefined) => loggerMethod('warn', message, metaData, 'backend'),
  info: (message: string, metaData: any = undefined) => loggerMethod('info', message, metaData, 'backend'),
  http: (message: string, metaData: any = undefined) => loggerMethod('http', message, metaData, 'backend'),
  verbose: (message: string, metaData: any = undefined) => loggerMethod('verbose', message, metaData, 'backend'),
  debug: (message: string, metaData: any = undefined) => loggerMethod('debug', message, metaData, 'backend'),
  silly: (message: string, metaData: any = undefined) => loggerMethod('silly', message, metaData, 'backend'),
};
