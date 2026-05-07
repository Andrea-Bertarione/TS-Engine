import {WorkerManager} from "./core/managers/workers/WorkerManager";
import {DefaultLogger} from "./core/classes/DefaultLogger";

export const THREAD_DATA = {
    world: { id: "world", path: "./src/core/managers/threads/worldThread.js" },
};

const setup = () => {
    const threadPool: Record<string, WorkerManager> = {};
    const logger = new DefaultLogger("[Main]");
    const WORKING_DIRECTORY = process.cwd();

    Object.values(THREAD_DATA).forEach(config => {
        threadPool[config.id] = new WorkerManager(config.id, config.path, WORKING_DIRECTORY)
            .withLogger(logger)
            .build();
    });

    return threadPool;
}

export const threadPool = setup();