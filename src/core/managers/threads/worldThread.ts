import {Thread} from "../../classes/Thread";
import {EventManager} from "../EventManager";
import {DefaultLogger} from "../../classes/DefaultLogger";
import { workerData, parentPort } from "worker_threads";
import {WorldManager} from "../WorldManager";
import {WorkerGateway} from "../workers/WorkerGateway";

const THREAD_ID = "world";
const THREAD_NAME = "World";
const TICKS_PER_SECOND = 60;

const WORLD_NAME = "main";

const onStart = () => {
    if (parentPort === null || workerData.id !== THREAD_ID) throw new Error(
        `You can't access ${THREAD_ID} from a different thread!, use the multi_threading manager.`
    )

    const worldThread = {
        thread: new Thread(THREAD_ID, THREAD_NAME, TICKS_PER_SECOND),
        eventManager: new EventManager(),
        logger: new DefaultLogger("[World]"),
        worldManager: new WorldManager(workerData.workingDirectory),
        workerGateway: new WorkerGateway(parentPort)
    }

    worldThread.workerGateway.withEventManager(worldThread.eventManager);
    worldThread.worldManager.withWorldEvents(worldThread.eventManager, THREAD_ID);

    worldThread.workerGateway.listen();

    worldThread.logger.info("Preparing world...");
    worldThread.worldManager.loadWorld(WORLD_NAME);

    worldThread.thread.start().catch(err => worldThread.logger.withException("Thread Crash!", err));

    return worldThread;
}

export const worldThread = onStart();