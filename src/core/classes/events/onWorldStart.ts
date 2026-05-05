import {BaseEvent} from "../Event";

export class onWorldStart extends BaseEvent {
    worldName: string;

    constructor(currentThread: string, worldName: string) {
        super(currentThread);
        this.worldName = worldName;
    }
}