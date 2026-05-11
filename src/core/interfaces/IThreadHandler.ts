import {IThread} from "./IThread";
import {ILogger} from "./ILogger";
import {WorkerGateway} from "../managers/workers/WorkerGateway";
import {WorldManager} from "../managers/WorldManager";
import {WorkerManager} from "../managers/workers/WorkerManager";
import {IEventManager, IGenericEventManager} from "./IEventManager";
import {ThreadEvent} from "../classes/events/ThreadEvent";
import {CommandType} from "../Types/MessageTypes";
import {THREAD_DATA} from "../../Configs/ThreadData";
import {BaseEvent} from "../classes/Event";
import {RenderingManager} from "../managers/rendering/RenderingManager";
import {CLIManager} from "../managers/logic/CLIManager";

//thread + eventManager + logger
export interface IThreadHandler {
    logger?: ILogger;
    thread?: IThread;

    withThread: (thread: IThread) => this;
    withEventManager: (eventManager : IGenericEventManager) => this;
    withLogger: (logger: ILogger) => this;

    build: () => IThreadHandler;
}

export interface IMainThreadHandler extends IThreadHandler {
    threadPool?: Record<string, WorkerManager>;
    cliManager?: CLIManager;

    withThreadPool: (configs: typeof THREAD_DATA, workingDirectory: string) => this;
    withEventManager: (eventManager : IEventManager<ThreadEvent<CommandType>>) => this;
    withCLIManager: (cliManager: CLIManager) => this;

    getEventManager: () => IEventManager<ThreadEvent<CommandType>>;
    getThread(threadName: string): WorkerManager | undefined;
    getThreadPool(): Record<string, WorkerManager>;
}

export interface IWorkerThreadHandler extends IThreadHandler {
    workerGateway?: WorkerGateway;
    withWorkerGateway: (workerGateway: WorkerGateway) => this;

    withEventManager: (eventManager : IEventManager<BaseEvent>) => this;

    getEventManager: () => IEventManager<BaseEvent>;
}

export interface IWorldThreadHandler extends IWorkerThreadHandler {
    worldManager?: WorldManager;
    workingDirectory?: string;

    withWorkingDirectory: (workingDirectory: string) => this;
    withWorldEvents: () => this;
}

export interface IRenderingThreadHandler extends IWorkerThreadHandler {
    renderingManager? : RenderingManager;

    width?: number;
    height?: number;
    vsync?: boolean;
    title?: string;

    withRenderingManager: (shutdownCallback: () => void) => this;
    withWidth: (width: number) => this;
    withHeight: (height: number) => this;
    withVsync: (vsync: boolean) => this;
    withTitle: (title: string) => this;
}