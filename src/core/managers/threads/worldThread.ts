import {Thread} from "../../classes/Thread";
import {EventManager} from "../EventManager";
import {DefaultLogger} from "../../classes/DefaultLogger";
import { workerData, parentPort } from "worker_threads";
import {WorkerGateway} from "../workers/WorkerGateway";
import {WorldThreadHandler} from "../../classes/ThreadHandlers/WorldThreadHandler";
import {onWorldStart} from "../../classes/events/onWorldStart";

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

    worldThread.eventManager?.subscribe(onWorldStart, (payload) => {
        //do stuff
    })

    return worldThread;
}

export const worldThread = onStart();