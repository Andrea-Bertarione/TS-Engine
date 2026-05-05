import {WorkerManager} from "./core/managers/workers/WorkerManager";
import {DefaultLogger} from "./core/classes/DefaultLogger";
import {WORLD_MESSAGES} from "./core/enums/WorldMessages";

const THREAD_DATA = {
    world: { id: "world", path: "./dist/core/managers/threads/worldThread.js" },
};

const setup = () => {
    const threadPool: Record<string, WorkerManager> = {};
    const logger = new DefaultLogger("[Main]");
    const WORKING_DIRECTORY = process.cwd();

    Object.values(THREAD_DATA).forEach(config => {
        const worker = new WorkerManager(config.id, config.path, WORKING_DIRECTORY);
        worker.withLogger(logger);
        worker.init();

        threadPool[config.id] = worker;
    });

    threadPool[THREAD_DATA.world.id]?.registerListener(WORLD_MESSAGES.WORLD_LOADED, (payload) => {
        logger.info("World loaded event received, world: " + payload.name);
    })
}

setup();