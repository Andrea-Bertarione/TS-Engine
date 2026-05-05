import {MessagePort} from "worker_threads";
import {EventManager} from "../EventManager";

export class WorkerGateway {
    messagePort: MessagePort;

    private eventManager: EventManager | null = null;

    constructor(messagePort: MessagePort) {
        this.messagePort = messagePort;
    }

    withEventManager(eventManager: EventManager) {
        this.eventManager = eventManager;
    }

    listen() {
        if (this.eventManager == null) throw new Error("EventManager not set!");


    }
}