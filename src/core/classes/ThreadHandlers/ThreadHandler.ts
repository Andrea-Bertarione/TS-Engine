import {IThreadHandler} from "../../interfaces/IThreadHandler";
import {EventManager} from "../../managers/EventManager";
import {ILogger} from "../../interfaces/ILogger";
import {IThread} from "../../interfaces/IThread";
import {WorkerGateway} from "../../managers/workers/WorkerGateway";

export class ThreadHandler implements IThreadHandler {
    eventManager?: EventManager;
    logger?: ILogger;
    thread?: IThread;
    workerGateway?: WorkerGateway;

    withEventManager(eventManger: EventManager): this {
        this.eventManager = eventManger;
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

    withWorkerGateway(workerGateway: WorkerGateway): this {
        this.workerGateway = workerGateway;

        if (this.workerGateway.eventManager == null) {
            this.workerGateway.withEventManager(this.eventManager!);
        }

        if (this.workerGateway.logger == null) {
            this.workerGateway.withLogger(this.logger!);
        }

        this.workerGateway.build()

        return this;
    }

    build(): this {
        if (this.eventManager == null) throw new Error("EventManager not set!");
        if (this.thread == null) throw new Error("Thread not set!");
        if (this.workerGateway == null) throw new Error("WorkerGateway not set!");
        if (this.logger == null) throw new Error("Logger not set!");
        if (this.thread.running) throw new Error("Thread is already running!");

        this.thread.start().catch(e => this.logger!.withException("Thread Error", e));

        return this;
    }
}