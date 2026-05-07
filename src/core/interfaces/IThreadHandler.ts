import {IThread} from "./IThread";
import {EventManager} from "../managers/EventManager";
import {ILogger} from "./ILogger";
import {WorkerGateway} from "../managers/workers/WorkerGateway";
import {WorldManager} from "../managers/WorldManager";

export interface IThreadHandler {
    eventManager?: EventManager;
    logger?: ILogger;
    thread?: IThread;
    workerGateway?: WorkerGateway;

    withThread: (thread: IThread) => IThreadHandler;
    withEventManager: (eventManger: EventManager) => IThreadHandler;
    withLogger: (logger: ILogger) => IThreadHandler;
    withWorkerGateway: (workerGateway: WorkerGateway) => IThreadHandler;
}

export interface IWorldThreadHandler extends IThreadHandler {
    worldManager?: WorldManager;
    workingDirectory?: string;

    withWorkingDirectory: (workingDirectory: string) => IWorldThreadHandler;
    withWorldEvents: () => IWorldThreadHandler;
}