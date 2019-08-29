export interface Logger {
    log: (message?: any, ...params: any[]) => void;
    info: (message?: any, ...params: any[]) => void;
    warn: (message?: any, ...params: any[]) => void;
    error: (message?: any, ...params: any[]) => void;
}
export declare class DefaultLogger implements Logger {
    private static instance;
    protected logger: (message?: any, ...optionalParams: any[]) => void;
    static getDefaultLogger(): DefaultLogger;
    private constructor();
    log(message?: any, ...params: any[]): void;
    info(message?: any, ...params: any[]): void;
    warn(message?: any, ...params: any[]): void;
    error(message?: any, ...params: any[]): void;
    private internalLog;
}
