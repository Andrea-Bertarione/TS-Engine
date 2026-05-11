import {ThreadPool} from "../core/Types/ThreadPool";

export const THREAD_DATA: ThreadPool = {
    world: { id: "world", path: "./dist/core/managers/threads/worldThread.js" },
    rendering: { id: "rendering", path: "./dist/core/managers/threads/renderingThread.js" },
};