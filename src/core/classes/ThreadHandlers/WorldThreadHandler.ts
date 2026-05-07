import {ThreadHandler} from "./ThreadHandler";
import {IWorldThreadHandler} from "../../interfaces/IThreadHandler";
import {WorldManager} from "../../managers/WorldManager";

export class WorldThreadHandler extends ThreadHandler implements IWorldThreadHandler{
    worldManager?: WorldManager;
    workingDirectory?: string;

    withWorkingDirectory(workingDirectory: string): this {
        this.workingDirectory = workingDirectory;
        this.worldManager = new WorldManager(this.workingDirectory);

        return this;
    }

    withWorldEvents(): this {
        if (this.worldManager == null) throw new Error("WorldManager not set!");
        if (this.eventManager == null) throw new Error("EventManager not set!");
        if (this.thread == null) throw new Error("Thread not set!");

        this.worldManager.withWorldEvents(this.eventManager, this.thread.id)
        return this;
    }
}