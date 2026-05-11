import {Thread} from "../../classes/Thread";
import {EventManager} from "../events/EventManager";
import {DefaultLogger} from "../../classes/DefaultLogger";
import {parentPort, workerData} from "worker_threads";
import {WorkerGateway} from "../workers/WorkerGateway";
import {RenderingThreadHandler} from "../../classes/ThreadHandlers/WorkerThreads/RenderingThreadHandler";
import {IThread} from "../../interfaces/IThread";
import {THREAD_MESSAGES} from "../../enums/ThreadMessages";

const THREAD_ID = "rendering";
const THREAD_NAME = "rending";
const TICKS_PER_SECOND = 244;

const onStart = () => {
    if (parentPort === null || workerData.id !== THREAD_ID) throw new Error(
        `You can't access ${THREAD_ID} from a different thread!, use the multi_threading manager.`
    )

    return new RenderingThreadHandler()
        .withThread(new Thread(THREAD_ID, THREAD_NAME, TICKS_PER_SECOND))
        .withEventManager(new EventManager())
        .withLogger(new DefaultLogger("[Rendering]"))
        .withWorkerGateway(
            new WorkerGateway(parentPort)
                .withLogger(new DefaultLogger("[rendering-Gateway]"))
        )
        .withRenderingManager((thread: IThread, workerGateway: WorkerGateway) => {
            thread.stop();

            workerGateway.send(THREAD_MESSAGES.THREAD_STOPPED, {
                reason: "Rendering thread stopped gracefully."
            });
        })
        .build();
}

export const renderingThread = onStart();