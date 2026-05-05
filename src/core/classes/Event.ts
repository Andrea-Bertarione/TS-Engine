export class BaseEvent {
    currentThread: string;

    constructor(currentThread: string) {
        this.currentThread = currentThread;
    }
}