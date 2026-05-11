import {IWorld} from "../interfaces/IWorld";
import { readFileSync, readdirSync, writeFileSync } from "fs";
import {EventManager} from "./events/EventManager";
import {onWorldStart} from "../classes/events/localEvents/onWorldStart";
import {mkdirSync} from "fs";
import {BaseEvent} from "../classes/Event";
import {IEventManager} from "../interfaces/IEventManager";
import {ILogger} from "../interfaces/ILogger";

const WORLD_FILE_EXTENSION = ".json";
const WORLD_FOLDER = "worlds";

export class WorldManager {
    workingDirectory: string;
    worlds: Set<string>;
    selectedWorld: IWorld | null;

    eventManager: IEventManager<BaseEvent> | null = null;
    logger: ILogger | null = null;
    currentThread: string | null = null;

    constructor(workingDirectory: string) {
        this.workingDirectory = workingDirectory;
        mkdirSync(`${workingDirectory}/${WORLD_FOLDER}`, { recursive: true });

        this.worlds = this.listWorlds();
        this.selectedWorld = null;
    }

    loadWorld(worldName: string): void {
        this.selectedWorld = this.worlds.has(worldName) ? this.readWorldData(worldName) : this.createWorld(worldName);

        if (this.eventManager != null && this.currentThread != null) {
            this.eventManager.emit(new onWorldStart(this.currentThread, worldName))
        }
    }

    createWorld(worldName: string): IWorld {
        const defaultWorldData: IWorld = {
            name: worldName,
            characters: {},
            entities: {},
            maps: {},
            selectedMap: ""
        }

        this.saveWorld(defaultWorldData);

        return defaultWorldData;
    }

    saveWorld(worldData: IWorld): void {
        try {
            writeFileSync(`${this.workingDirectory}/${WORLD_FOLDER}/${worldData.name}${WORLD_FILE_EXTENSION}`, JSON.stringify(worldData, null, 4));
        }
         catch (e: unknown) {
            if (e instanceof Error) {
                this.logger?.withException("World save error", e);
            } else {
                this.logger?.withException("World save error", new Error(String(e)));
            }
        }

        this.logger?.info(`World ${worldData.name} saved!`);
    }

    withWorldEvents(eventManager: EventManager, currentThread: string) : this {
        this.eventManager = eventManager;
        this.currentThread = currentThread;

        return this;
    }

    withLogger(logger: ILogger): this {
        this.logger = logger;

        return this;
    }

    private readWorldData(worldName: string): IWorld {
        const worldBuffer = readFileSync(`${this.workingDirectory}/${WORLD_FOLDER}/${worldName}${WORLD_FILE_EXTENSION}`);
        const worldData: IWorld = JSON.parse(worldBuffer.toString());

        if (worldData.name !== worldName) throw new Error("World name doesn't match file name!");

        return worldData;
    }

    private listWorlds(): Set<string> {
        return new Set(readdirSync(`${this.workingDirectory}/${WORLD_FOLDER}`).map(file => file.replace(WORLD_FILE_EXTENSION, '')));
    }
}