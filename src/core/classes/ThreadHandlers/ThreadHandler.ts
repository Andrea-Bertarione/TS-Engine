import {IThreadHandler} from "../../interfaces/IThreadHandler";
import {EventManager} from "../../managers/events/EventManager";
import {ILogger} from "../../interfaces/ILogger";
import {IThread} from "../../interfaces/IThread";
import {IEventManager} from "../../interfaces/IEventManager";
import {BaseEvent} from "../Event";

export class ThreadHandler implements IThreadHandler {
    eventManager?: IEventManager<BaseEvent>;
    logger?: ILogger;
    thread?: IThread;

    withEventManager(eventManager : IEventManager<any>): this {
        this.eventManager = eventManager ;
        return this
    }

    withLogger(logger: ILogger): this {
        this.logger = logger;
        return this;
    }

    withThread(thread: IThread): this {
        this.thread = thread;
        return this;
    }

    build(): this {
        if (this.eventManager == null) throw new Error("EventManager not set!");
        if (this.thread == null) throw new Error("Thread not set!");
        if (this.logger == null) throw new Error("Logger not set!");
        if (this.thread.running) throw new Error("Thread is already running!");

        this.thread.start().catch(e => this.logger!.withException("Thread Error", e));

        return this;
    }
}