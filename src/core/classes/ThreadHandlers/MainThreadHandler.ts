import {ThreadHandler} from "./ThreadHandler";
import {IMainThreadHandler} from "../../interfaces/IThreadHandler";
import {WorkerManager} from "../../managers/workers/WorkerManager";
import {MainEventManager} from "../../managers/events/MainEventManager";
import {DefaultLogger} from "../DefaultLogger";
import {IEventManager} from "../../interfaces/IEventManager";
import {ThreadEvent} from "../events/ThreadEvent";
import {CommandType} from "../../Types/MessageTypes";
import {ThreadPool} from "../../Types/ThreadPool";
import {CLIManager} from "../../managers/logic/CLIManager";

export class MainThreadHandler extends ThreadHandler implements IMainThreadHandler{
    threadPool?: Record<string, WorkerManager>
    cliManager? : CLIManager;

    withThreadPool(configs: ThreadPool, workingDirectory: string): this {
        this.threadPool = {};
        Object.values(configs).forEach(config => {
            this.threadPool![config.id] = new WorkerManager(config.id, config.path, workingDirectory)
                .withLogger(this.logger ?? new DefaultLogger(`[${config.id}]`))
                .build();
        });
        return this;
    }

    withEventManager(): this {
        if (this.threadPool == null) throw new Error("ThreadPool not set!");
        return super.withEventManager(new MainEventManager(this.threadPool));
    }

    withCLIManager(): this {
        this.cliManager = new CLIManager();
        return this;
    }

    getEventManager(): IEventManager<ThreadEvent<CommandType>> {
        return this.eventManager as IEventManager<ThreadEvent<CommandType>>;
    }

    getThread(threadId: string): WorkerManager | undefined {
        return this.threadPool?.[threadId];
    }

    getThreadPool(): Record<string, WorkerManager> {
        return this.threadPool!;
    }

    build(): this {
        if (this.threadPool == null) throw new Error("ThreadPool not set!");

        this.cliManager!.startCLI(this.thread!);

        return super.build();
    }
}