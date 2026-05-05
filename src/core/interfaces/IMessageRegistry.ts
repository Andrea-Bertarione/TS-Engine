import {THREAD_MESSAGES} from "../enums/ThreadMessages";
import {WORLD_MESSAGES} from "../enums/WorldMessages";

// Enum -> Message
export interface IMessageRegistry {
    [THREAD_MESSAGES.STOP_THREAD]: { reason: string };
    [THREAD_MESSAGES.PAUSE_THREAD]: { reason: string };
    [WORLD_MESSAGES.WORLD_LOADED]: { name: string };
    [WORLD_MESSAGES.WORLD_LOAD]: { name: string };
    [WORLD_MESSAGES.WORLD_CREATE]: { name: string };
}