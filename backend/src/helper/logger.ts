import winston from 'winston';
import path from 'path';
import fs from 'fs';
import config from 'config';

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

let logger: winston.Logger;

export const getLogger = () => {
  if (logger) {
    return logger;
  }

  const logFilePath = path.join(__dirname, '../../logs/');

  try {
    fs.accessSync(logFilePath);
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      fs.mkdirSync(logFilePath, { recursive: true });
    }
  }

  logger = winston.createLogger({
    exitOnError: false,
    transports: [
      new (winston.transports.File)({
        level: config.get('LOG_LEVEL_FILE'),
        filename: path.join(logFilePath, 'log.log'),
        handleExceptions: true,
        maxsize: 5242880,
        maxFiles: 10,
        format: winston.format.combine(
          winston.format.uncolorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message }) => `${timestamp} | ${level} | ${message}`),
        ),
      }),
      new (winston.transports.Console)({
        level: config.get('LOG_LEVEL_CONSOLE'),
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`),
        ),
      }),
    ],
  });
  return logger;
};
