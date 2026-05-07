import {IThread} from "./IThread";
import {EventManager} from "../managers/events/EventManager";
import {ILogger} from "./ILogger";
import {WorkerGateway} from "../managers/workers/WorkerGateway";
import {WorldManager} from "../managers/WorldManager";
import {WorkerManager} from "../managers/workers/WorkerManager";
import {IEventManager} from "./IEventManager";
import {ThreadEvent} from "../classes/events/ThreadEvent";
import {CommandType} from "../Types/MessageTypes";
import {THREAD_DATA} from "../../index";

//thread + eventManager + logger
export interface IThreadHandler {
    eventManager?: IEventManager<any>;
    logger?: ILogger;
    thread?: IThread;

    withThread: (thread: IThread) => this;
    withEventManager: (eventManager : IEventManager<any>) => this;
    withLogger: (logger: ILogger) => this;

    build: () => IThreadHandler;
}

export interface IMainThreadHandler extends IThreadHandler {
    threadPool?: Record<string, WorkerManager>;

    withThreadPool: (configs: typeof THREAD_DATA, workingDirectory: string) => this;
    withEventManager: (eventManager : IEventManager<ThreadEvent<CommandType>>) => this;
}

export interface IWorkerThreadHandler extends IThreadHandler {
    workerGateway?: WorkerGateway;
    withWorkerGateway: (workerGateway: WorkerGateway) => this;
}

export interface IWorldThreadHandler extends IWorkerThreadHandler {
    worldManager?: WorldManager;
    workingDirectory?: string;

    withWorkingDirectory: (workingDirectory: string) => this;
    withWorldEvents: () => this;
}