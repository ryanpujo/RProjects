import { resolve } from 'path';
import { config } from 'dotenv';
import fs from 'fs';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: 'user-service',
  transports: [
    new winston.transports.File({ level: 'error', filename: 'error.log' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
if (fs.existsSync('.env')) {
  config({ path: resolve(process.cwd(), '.env') });
} else {
  logger.info('there is no .env file avilable');
  logger.add(
    new winston.transports.Console({ format: winston.format.simple() }),
  );
}

export const ENVIRONMENT = process.env.NODE_ENV;
const isProd = ENVIRONMENT === 'production';
export const SESSION_SECRET = `${process.env.SESSION_SECRET}`;
export const MONGO_URI = isProd
  ? `${process.env.MONGO_URI}`
  : `${process.env.MONGO_URI_LOCAL}`;

if (!SESSION_SECRET) {
  logger.error('No client secret. Set SESSION_SECRET environment variable.');
  process.exit(1);
}
if (!MONGO_URI) {
  if (isProd) {
    logger.error(
      'No mongo connection string. Set MONGODB_URI environment variable.',
    );
  } else {
    logger.error(
      'No mongo connection string. Set MONGODB_URI_LOCAL environment variable.',
    );
  }
  process.exit(1);
}
