import {BaseEvent} from "../Event";
import {ThreadID} from "../../Types/ThreadPool";
import {CommandType} from "../../Types/MessageTypes";
import {IWorkerCommands} from "../../interfaces/IMessageRegistry";

export class ThreadEvent<K extends CommandType> extends BaseEvent {
    targets: ThreadID[];
    command: K;
    payload: IWorkerCommands[K];

    constructor(targets: ThreadID[], command: K, payload: IWorkerCommands[K]) {
        super("Main");

        this.targets = targets;
        this.command = command;
        this.payload = payload;
    }
}