export interface ILogger {
    prefix: string;

    withException(context: string, exception: Error): void;

    info(message: string): void;
    warning(message: string): void;
    severe(message: string): void;
}