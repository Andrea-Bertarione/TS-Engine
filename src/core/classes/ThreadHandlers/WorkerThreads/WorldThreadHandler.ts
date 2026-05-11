import {IWorldThreadHandler} from "../../../interfaces/IThreadHandler";
import {WorldManager} from "../../../managers/WorldManager";
import {WorkerThreadHandler} from "../WorkerThreadHandler";
import {EventManager} from "../../../managers/events/EventManager";

export class WorldThreadHandler extends WorkerThreadHandler implements IWorldThreadHandler{
    worldManager?: WorldManager;
    workingDirectory?: string;

    withWorkingDirectory(workingDirectory: string): this {
        this.workingDirectory = workingDirectory;
        this.worldManager = new WorldManager(this.workingDirectory);
        this.worldManager.withLogger(this.logger!);

        return this;
    }

    withWorldEvents(): this {
        if (this.worldManager == null) throw new Error("WorldManager not set!");
        if (this.eventManager == null) throw new Error("EventManager not set!");
        if (this.thread == null) throw new Error("Thread not set!");

        if (this.eventManager instanceof EventManager) {
            this.worldManager.withWorldEvents(this.eventManager, this.thread.id)
        }
        return this;
    }

    build(): this {
        if (this.worldManager == null) throw new Error("WorldManager not set!");

        return super.build();
    }
}