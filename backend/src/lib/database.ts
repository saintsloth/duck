import mongoose from 'mongoose';
import { exit } from 'process';
// eslint-disable-next-line import/no-cycle
import { logger } from './logger';

export interface DbConfig {
  login: string;
  password: string;
  host: string;
  port: string;
  database: string;
}

export const dbConnect = async (dbConfig: DbConfig) => {
  const {
    login, password, host, port, database,
  } = dbConfig;

  try {
    logger.debug('Connecting to database...');
    await mongoose.connect(`mongodb://${login}:${password}@${host}:${port}/${database}?authSource=admin`);
  } catch (err) {
    logger.error(`Critical error: could not connect to MongoDB: ${err}`);
    logger.info('Execution stopped');
    exit();
  }
  logger.debug('Connected to MongoDB');
};
