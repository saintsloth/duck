import { getLogger } from './logger';
import { exit } from 'process';

const requiredVariables = [
  'APP_PORT',
  'DB_LOGIN',
  'DB_PASSWORD',
  'DB_PORT',
  'DB_NAME',
  'DB_HOST',
  'SECRET_KEY',
]

export const checkEnvironmentVariables = () => {
  const missingVariables = [];

  requiredVariables.forEach(variable => {
    if (process.env[variable] === undefined) {
      getLogger().error(`Critical error: environment variable ${variable} not defined in .${process.env.NODE_ENV}.env`);
      missingVariables.push(variable);
    }
  })

  if (missingVariables.length > 0) exit();
}