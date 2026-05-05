import {ILogger} from "../interfaces/ILogger";

export class DefaultLogger implements ILogger{
    prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    info(message: string): void {
        console.log(`${this.prefix} ${message}`);
    }

    warning(message: string): void {
        console.warn(`${this.prefix} ${message}`);
    }

    severe(message: string): void {
        console.error(`${this.prefix} ${message}`);
    }

    withException(context: string, exception: Error): void {
        console.error(`${this.prefix} ${context}: ${exception.message} \n${exception.stack}`);
    }
}