import {Thread} from "../../classes/Thread";
import {EventManager} from "../EventManager";
import {DefaultLogger} from "../../classes/DefaultLogger";
import { workerData, parentPort } from "worker_threads";
import {WorkerGateway} from "../workers/WorkerGateway";
import {WorldThreadHandler} from "../../classes/ThreadHandlers/WorldThreadHandler";
import {onWorldStart} from "../../classes/events/onWorldStart";
import {WORLD_MESSAGES} from "../../enums/WorldMessages";

const THREAD_ID = "world";
const THREAD_NAME = "World";
const TICKS_PER_SECOND = 60;

const onStart = () => {
    if (parentPort === null || workerData.id !== THREAD_ID) throw new Error(
        `You can't access ${THREAD_ID} from a different thread!, use the multi_threading manager.`
    )

    const worldThread: WorldThreadHandler = new WorldThreadHandler()
        .withThread(new Thread(THREAD_ID, THREAD_NAME, TICKS_PER_SECOND))
        .withEventManager(new EventManager())
        .withLogger(new DefaultLogger("[World]"))
        .withWorkerGateway(
            new WorkerGateway(parentPort)
                .withLogger(new DefaultLogger("[World-Gateway]"))
        )
        .withWorkingDirectory(workerData.workingDirectory)
        .withWorldEvents()
        .build();

    bindWorldEvents(worldThread);
    bindMessageEvents(worldThread);

    return worldThread;
}

const bindWorldEvents = (worldThread: WorldThreadHandler) => {
    if (worldThread.eventManager == null) throw new Error("EventManager not set!");

    // onWorldStart
    worldThread.eventManager.subscribe(onWorldStart, (payload) => {
        if (worldThread.workerGateway == null) throw new Error("WorkerGateway not set!");
        if (worldThread.logger == null) throw new Error("Logger not set!");

        worldThread.logger.info("Loading world: " + payload.worldName);

        worldThread.workerGateway.send(WORLD_MESSAGES.WORLD_LOADED, { name: payload.worldName });
    });
}

const bindMessageEvents = (worldThread: WorldThreadHandler) => {
    if (worldThread.workerGateway == null) throw new Error("WorkerGateway not set!");
    if (worldThread.worldManager == null) throw new Error("WorldManager not set!");

    //Load event
    worldThread.workerGateway.on(WORLD_MESSAGES.WORLD_LOAD, (payload) => {
       worldThread.worldManager?.loadWorld(payload.name);
    });

    //Create event
    worldThread.workerGateway.on(WORLD_MESSAGES.WORLD_CREATE, (payload) => {
        worldThread.worldManager?.createWorld(payload.name);
    });
}

export const worldThread = onStart();