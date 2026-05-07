import {DefaultLogger} from "./core/classes/DefaultLogger";
import {ThreadPool} from "./core/Types/ThreadPool";
import {MainThreadHandler} from "./core/classes/ThreadHandlers/MainThreadHandler";
import {Thread} from "./core/classes/Thread";
import {IMainThreadHandler} from "./core/interfaces/IThreadHandler";

const threadID = "main";
const threadName = "Main";
const ticksPerSecond = 60;

export const THREAD_DATA: ThreadPool = {
    world: { id: "world", path: "./src/core/managers/threads/worldThread.js" },
};

const setup = () => {
    const WORKING_DIRECTORY = process.cwd();

    return new MainThreadHandler()
        .withLogger(new DefaultLogger("[Main]"))
        .withThreadPool(THREAD_DATA, WORKING_DIRECTORY)
        .withEventManager()
        .withThread(new Thread(threadID, threadName, ticksPerSecond))
        .build();
}

export const mainThreadHandler: IMainThreadHandler = setup();