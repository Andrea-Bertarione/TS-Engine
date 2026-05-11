import {DefaultLogger} from "./core/classes/DefaultLogger";
import {MainThreadHandler} from "./core/classes/ThreadHandlers/MainThreadHandler";
import {Thread} from "./core/classes/Thread";
import {IMainThreadHandler} from "./core/interfaces/IThreadHandler";
import {THREAD_DATA} from "./Configs/ThreadData";
import {THREAD_MESSAGES} from "./core/enums/ThreadMessages";

const threadID = "main";
const threadName = "Main";
const ticksPerSecond = 60;

const setup = () => {
    const WORKING_DIRECTORY = process.cwd();

    const mainThread: MainThreadHandler = new MainThreadHandler()
        .withLogger(new DefaultLogger("[Main]"))
        .withThreadPool(THREAD_DATA, WORKING_DIRECTORY)
        .withEventManager()
        .withThread(new Thread(threadID, threadName, ticksPerSecond))
        .withCLIManager()
        .build();

    registerMessageHandlers(mainThread);

    return mainThread;
}

const registerMessageHandlers = (mainThread: IMainThreadHandler) => {
    mainThread.getThread(THREAD_DATA["rendering"]!.id)?.registerListener(THREAD_MESSAGES.THREAD_STOPPED, (payload) => {
       mainThread.logger!.warning("Rendering thread was stopped with reason : " + payload.reason);
       mainThread.logger!.info("Shutting down...");

       Object.values(mainThread.getThreadPool()).filter(s => s.id !== THREAD_DATA["rendering"]!.id).forEach(s =>{
          s.sendMessage(THREAD_MESSAGES.STOP_THREAD, { reason: "Rendering thread stopped, shutting down." });
       });

       mainThread.logger!.info("Sent to all threads a stop signal.");
       mainThread.thread!.stop();

       process.exit(0);
    });
}

export const mainThreadHandler: IMainThreadHandler = setup();