import {ThreadHandler} from "./ThreadHandler";
import {IMainThreadHandler} from "../../interfaces/IThreadHandler";
import {WorkerManager} from "../../managers/workers/WorkerManager";
import {MainEventManager} from "../../managers/events/MainEventManager";
import {THREAD_DATA} from "../../../index";
import {DefaultLogger} from "../DefaultLogger";

export class MainThreadHandler extends ThreadHandler implements IMainThreadHandler{
    threadPool?: Record<string, WorkerManager>

    withThreadPool(configs: typeof THREAD_DATA, workingDirectory: string): this {
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

    build(): this {
        if (this.threadPool == null) throw new Error("ThreadPool not set!");

        return super.build();
    }
}