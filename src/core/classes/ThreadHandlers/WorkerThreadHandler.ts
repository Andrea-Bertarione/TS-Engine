import {ThreadHandler} from "./ThreadHandler";
import {IWorkerThreadHandler} from "../../interfaces/IThreadHandler";
import {WorkerGateway} from "../../managers/workers/WorkerGateway";
import {IEventManager} from "../../interfaces/IEventManager";
import {BaseEvent} from "../Event";

export class WorkerThreadHandler extends ThreadHandler implements IWorkerThreadHandler {
    workerGateway?: WorkerGateway;

    withWorkerGateway(workerGateway: WorkerGateway): this {
        this.workerGateway = workerGateway;

        if (this.workerGateway.eventManager == null) {
            this.workerGateway.withEventManager(this.eventManager!);
        }

        if (this.workerGateway.logger == null) {
            this.workerGateway.withLogger(this.logger!);
        }

        this.workerGateway.build()

        return this;
    }

    withEventManager(eventManager : IEventManager<BaseEvent>): this {
        this.eventManager = eventManager ;
        return this
    }

    build(): this {
        if (this.workerGateway == null) throw new Error("WorkerGateway not set!");

        return super.build();
    }
}