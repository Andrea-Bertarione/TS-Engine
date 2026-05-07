import {THREAD_MESSAGES} from "../enums/ThreadMessages";
import {WORLD_MESSAGES} from "../enums/WorldMessages";

// Enum -> Message
export interface IWorkerCommands {
    [WORLD_MESSAGES.WORLD_LOAD]:   { name: string };
    [WORLD_MESSAGES.WORLD_CREATE]: { name: string };
    [THREAD_MESSAGES.STOP_THREAD]: { reason: string };
    [THREAD_MESSAGES.PAUSE_THREAD]: { reason: string };
}

// Worker → Main (events)
export interface IWorkerEvents {
    [WORLD_MESSAGES.WORLD_LOADED]: { name: string };
}

// Combined (for shared types like AnyEngineMessage)
export interface IMessageRegistry extends IWorkerCommands, IWorkerEvents {}