import {IWorld} from "../interfaces/IWorld";
import { readFileSync, readdirSync, writeFileSync } from "fs";
import {EventManager} from "./EventManager";
import {onWorldStart} from "../classes/events/onWorldStart";
import {IThread} from "../interfaces/IThread";

const WORLD_FILE_EXTENSION = ".json";
const WORLD_FOLDER = "worlds";

export class WorldManager {
    workingDirectory: string;
    worlds: Set<String>;
    selectedWorld: IWorld | null;

    eventManager: EventManager | null = null;
    currentThread: string | null = null;

    constructor(workingDirectory: string) {
        this.workingDirectory = workingDirectory;
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
        writeFileSync(`${this.workingDirectory}/${WORLD_FOLDER}/${worldData.name}${WORLD_FILE_EXTENSION}`, JSON.stringify(worldData, null, 4));
    }

    withWorldEvents(eventManager: EventManager, currentThread: string) {
        this.eventManager = eventManager;
        this.currentThread = currentThread;
    }

    private readWorldData(worldName: string): IWorld {
        const worldBuffer = readFileSync(`${this.workingDirectory}/${WORLD_FOLDER}/${worldName}${WORLD_FILE_EXTENSION}`);
        const worldData: IWorld = JSON.parse(worldBuffer.toString());

        if (worldData.name !== worldName) throw new Error("World name doesn't match file name!");

        return worldData;
    }

    private listWorlds(): Set<String> {
        return new Set(readdirSync(`${this.workingDirectory}/${WORLD_FOLDER}`).map(file => file.replace(WORLD_FILE_EXTENSION, '')));
    }
}