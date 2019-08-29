import chalk from 'chalk';
import { isEmpty } from 'lodash';
import { isNull } from 'util';

export interface Logger {
    log: (message?: any, ...params: any[]) => void;
    info: (message?: any, ...params: any[]) => void;
    warn: (message?: any, ...params: any[]) => void;
    error: (message?: any, ...params: any[]) => void;
}

export class DefaultLogger implements Logger {
    private static instance: DefaultLogger;

    protected logger: (message?: any, ...optionalParams: any[]) => void;

    public static getDefaultLogger() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new DefaultLogger();
        return this.instance;
    }

    private constructor() {
        // tslint:disable-next-line:no-console
        this.logger = console.log;
    }

    public log(message?: any, ...params: any[]): void {
        this.internalLog(message, ...params);
    }

    public info(message?: any, ...params: any[]): void {
        this.internalLog(chalk.blueBright(message), ...params);
    }

    public warn(message?: any, ...params: any[]): void {
        this.internalLog(chalk.yellow(message), ...params);
    }

    public error(message?: any, ...params: any[]): void {
        this.internalLog(chalk.red(message), ...params);
    }

    private internalLog(message?: any, ...params: any[]): void {
        isNull(params) || isEmpty(params) ? this.logger(message) : this.logger(message, params);
    }
}
