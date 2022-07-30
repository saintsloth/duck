import { exit } from 'process';
import { logger } from './logger';

const requiredVariables = [
  'BACKEND_PORT',
  'BACKEND_HOST',
  'BACKEND_PORT',
  'FRONTEND_PROTOCOL',
  'FRONTEND_HOST',
  'FRONTEND_PORT',
  'DB_LOGIN',
  'DB_PASSWORD',
  'DB_PORT',
  'DB_NAME',
  'DB_HOST',
  'SECRET_KEY',
  'WEB_SESSION_SECRET_KEY',
];

export const checkEnvironmentVariables = () => {
  const missingVariables = [];

  requiredVariables.forEach((variable) => {
    if (process.env[variable] === undefined) {
      logger.error(`Critical error: environment variable ${variable} not defined in .${process.env.NODE_ENV}.env`);
      missingVariables.push(variable);
    }
  });

  if (missingVariables.length > 0) exit();
};
