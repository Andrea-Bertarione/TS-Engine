import { Worker } from "worker_threads";
import path from "path";
import {ILogger} from "../../interfaces/ILogger";
import {IWorkerCommands, IWorkerEvents} from "../../interfaces/IMessageRegistry";
import {AnyEngineEvent, CommandType, EventType} from "../../Types/MessageTypes";

// Builder pattern + Event pattern
export class WorkerManager {
    id: string;
    path: string;
    workingDirectory: string;

    private worker: Worker | null = null;
    private logger: ILogger | null = null;

    private registeredListeners: Map<EventType, Set<(payload: any) => void>> = new Map();

    constructor(id: string, filePath: string, workingDirectory: string) {
        this.id = id;
        this.path = filePath;
        this.workingDirectory = workingDirectory;
    }

    build(): WorkerManager {
        this.worker = new Worker(path.resolve(this.path), {
            workerData: {
                id: this.id,
                workingDirectory: this.workingDirectory
            }
        });

        this.worker.on("message", (msg: AnyEngineEvent) => this.handleMessage(msg));

        this.worker.on("error", (error) => {
            if (this.logger != null) this.logger.withException("Worker Error", error);
            else console.error(`Worker ${this.id} crashed: ${error}`);
        });

        this.worker.on("exit", (code) => {
           if (code !== 0 && this.logger != null) this.logger.severe(`Worker ${this.id} stopped with exit code ${code}`);
           else if (code === 0 && this.logger != null) this.logger.info(`Worker ${this.id} shutdown`);
           else console.log(`Worker ${this.id} stopped`);
        });

        return this;
    }

    withLogger(logger: ILogger): WorkerManager {
        this.logger = logger;
        return this;
    }

    sendMessage<k extends CommandType>(type: k, payload: IWorkerCommands[k]) {
        this.worker?.postMessage({ type, payload });
    }

    registerListener<k extends EventType>(type: k, callback: (payload: IWorkerEvents[k]) => void) {
        if (!this.registeredListeners.has(type)) this.registeredListeners.set(type, new Set());

        this.registeredListeners.get(type)!.add(callback);
    }

    removeListener<k extends EventType>(type: k, callback: (payload: IWorkerEvents[k]) => void) {
        if (this.registeredListeners.has(type)) this.registeredListeners.get(type)!.delete(callback);
    }

    private handleMessage(message: AnyEngineEvent) {
        const eventSet = this.registeredListeners.get(message.type);
        if (eventSet != null) eventSet.forEach(event => event(message.payload));
    }
}