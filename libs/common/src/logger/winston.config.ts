import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

export const createWinstonConfig = (
  appName: string
): winston.LoggerOptions => ({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ context, level, timestamp, message }) => {
          return `[${appName}] ${timestamp} ${level} [${context || 'App'}] ${message}`;
        })
      ),
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(appName, {
          prettyPrint: true,
        })
      ),
    }),
  ],
});
