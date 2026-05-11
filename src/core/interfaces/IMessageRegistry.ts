import {THREAD_MESSAGES} from "../enums/ThreadMessages";
import {WORLD_MESSAGES} from "../enums/WorldMessages";

// Main (commands) -> Worker
export interface IWorkerCommands {
    [WORLD_MESSAGES.WORLD_LOAD]:   { name: string };
    [WORLD_MESSAGES.WORLD_CREATE]: { name: string };
    [THREAD_MESSAGES.STOP_THREAD]: { reason: string };
    [THREAD_MESSAGES.PAUSE_THREAD]: { reason: string };
}

// Worker → Main (events)
export interface IWorkerEvents {
    [WORLD_MESSAGES.WORLD_LOADED]: { name: string };
    [THREAD_MESSAGES.THREAD_STOPPED]: { reason: string };
}