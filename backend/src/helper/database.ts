import mongoose from "mongoose";
import { getLogger } from './logger';
import { exit } from 'process';

interface DbConfig {
  login: string;
  password: string;
  host: string;
  port: string;
  database: string;
}

export const dbConnect = async (config: DbConfig) => {
  const { login, password, host, port, database } = config;

  try {
    getLogger().debug('Connecting to database...');
    await mongoose.connect(`mongodb://${login}:${password}@${host}:${port}/${database}?authSource=admin`)
  } catch (err) {
    getLogger().error(`Critical error: could not connect to MongoDB: ${err}`);
    getLogger().info('Execution stopped');
    exit();
  }
  getLogger().debug('Connected to MongoDB')
}