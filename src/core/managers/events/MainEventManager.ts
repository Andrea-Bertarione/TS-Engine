import {EventConstructor, EventManager} from "./EventManager";
import {ThreadEvent} from "../../classes/events/ThreadEvent";
import {WorkerManager} from "../workers/WorkerManager";
import {ThreadID} from "../../Types/ThreadPool";
import {CommandType} from "../../Types/MessageTypes";
import {BaseEvent} from "../../classes/Event";
import {IEventManager} from "../../interfaces/IEventManager";

export type ThreadEventConstructor<T extends ThreadEvent<CommandType>> = new (...args: any[]) => T;
export class MainEventManager implements IEventManager<ThreadEvent<CommandType>> {
    private readonly eventManager: EventManager = new EventManager();
    threadPool: Record<string, WorkerManager>;

    constructor(threadPool: Record<string, WorkerManager>) {
        this.threadPool = threadPool;
    }

    // Narrow API — ThreadEvent only, fans out to workers
    public subscribe<K extends CommandType, T extends ThreadEvent<K>>(
        eventClass: ThreadEventConstructor<T>,
        callback: (event: T) => void
    ): void {
        this.eventManager.subscribe(eventClass, callback);
    }

    public emit<K extends CommandType, T extends ThreadEvent<K>>(event: T): void {
        this.eventManager.emit(event);

        event.targets.forEach((threadId: ThreadID) => {
            const worker = this.threadPool[threadId];
            worker?.sendMessage(event.command, event.payload);
        });
    }

    // Escape hatch for internal non-thread events if ever needed
    public emitLocal<T extends BaseEvent>(event: T): void {
        this.eventManager.emit(event);
    }

    public subscribeLocal<T extends BaseEvent>(
        eventClass: EventConstructor<T>,
        callback: (event: T) => void
    ): void {
        this.eventManager.subscribe(eventClass, callback);
    }
}