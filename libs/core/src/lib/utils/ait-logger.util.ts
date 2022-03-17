// import { environment } from './../../environments/environment';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as chalk from 'chalk';
import * as PrettyError from 'pretty-error';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { Logger, LoggerOptions } from 'winston';

// delare log type
const enum LOG_TYPE {
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  ERROR = 'ERROR',
  WARN = 'WARN'
}

/**
 * ! Review later
 *
 * @export
 * @class AitLogger
 */
export class AitLogger {
  private readonly logger: Logger;
  private readonly prettyError = new PrettyError();
  public static loggerOptions: LoggerOptions = {
    transports: [
      new winston.transports.DailyRotateFile({
        filename: `./logs/api_%DATE%.log`,
        datePattern: 'YYYYMMDD'
      })
    ]
  };

  constructor(private context: string) {
    this.logger = (winston as any).createLogger(AitLogger.loggerOptions);
    this.prettyError.skipNodeFiles();
    this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core');
  }

  /**
   *
   *
   * @readonly
   * @type {Logger}
   * @memberof AitLogger
   */
  get Logger(): Logger {
    return this.logger; // idk why i have this in my code !
  }

  /**
   *
   *
   * @static
   * @param {LoggerOptions} [options]
   * @memberof AitLogger
   */
  static configGlobal(options?: LoggerOptions) {
    this.loggerOptions = options;
  }

  /**
   *
   *
   * @param {string} message
   * @memberof AitLogger
   */
  log(message: string): void {
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context
    });
    this.formatedLog(LOG_TYPE.INFO, message);
  }

  /**
   *
   *
   * @param {string} message
   * @memberof AitLogger
   */
  verbose(message: string): void {
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context
    });
    this.formatedLog(LOG_TYPE.INFO, message);
  }

  /**
   *
   *
   * @param {string} message
   * @memberof AitLogger
   */
  debug(message: string): void {
    const currentDate = new Date();
    this.logger.debug(message, {
      timestamp: currentDate.toISOString(),
      context: this.context
    });
    this.formatedLog(LOG_TYPE.DEBUG, message);
  }

  /**
   *
   *
   * @param {string} message
   * @param {*} [trace]
   * @memberof AitLogger
   */
  error(message: string, trace?: any): void {
    const currentDate = new Date();

    this.logger.error(`${message} -> (${trace || 'trace not provided !'})`, {
      timestamp: currentDate.toISOString(),
      context: this.context
    });
    this.formatedLog(LOG_TYPE.ERROR, message, trace);
  }

  /**
   *
   *
   * @param {string} message
   * @memberof AitLogger
   */
  warn(message: string): void {
    const currentDate = new Date();
    this.logger.warn(message, {
      timestamp: currentDate.toISOString(),
      context: this.context
    });
    this.formatedLog(LOG_TYPE.WARN, message);
  }

  /**
   *
   *
   * @param {LoggerOptions} options
   * @memberof AitLogger
   */
  overrideOptions(options: LoggerOptions): void {
    this.logger.configure(options);
  }

  /**
   *
   *
   * @private
   * @param {LOG_TYPE} level
   * @param {string} message
   * @param {*} [error]
   * @memberof AitLogger
   */
  private formatedLog(level: LOG_TYPE, message: string, error?): void {
    let result = '';
    const color = chalk.green;
    const currentDate = new Date();
    const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    switch (level) {
      case LOG_TYPE.INFO:
        result = `[${color.blue(level)}] ${color.dim.yellow.bold.underline(
          time
        )} [${color.green(this.context)}] ${message}`;
        break;
      case LOG_TYPE.ERROR:
        result = `[${color.red(level)}] ${color.dim.yellow.bold.underline(
          time
        )} [${color.green(this.context)}] ${message}`;
        // if (error &&  !environment.production) //TODO
        if (error)
          this.prettyError.render(error, true);
        break;
      case LOG_TYPE.WARN:
        result = `[${color.yellow(level)}] ${color.dim.yellow.bold.underline(
          time
        )} [${color.green(this.context)}] ${message}`;
        break;
      case LOG_TYPE.DEBUG:
        result = `[${color.yellow(level)}] ${color.dim.yellow.bold.underline(
          time
        )} [${color.green(this.context)}] ${message}`;
        break;
      default:
        break;
    }
  }
}
