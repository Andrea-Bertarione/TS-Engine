import {MessagePort} from "worker_threads";
import {ILogger} from "../../interfaces/ILogger";
import {AnyEngineCommand, CommandType, EventType} from "../../Types/MessageTypes";
import {IWorkerCommands, IWorkerEvents} from "../../interfaces/IMessageRegistry";
import {IEventManager} from "../../interfaces/IEventManager";
import {BaseEvent} from "../../classes/Event";
import {THREAD_MESSAGES} from "../../enums/ThreadMessages";

// Builter pattern + DependencyInjection
export class WorkerGateway {
    messagePort: MessagePort;

    eventManager: IEventManager<BaseEvent> | null = null;
    logger: ILogger | null = null;

    private handlers: Map<CommandType, Set<(payload: any) => void>> = new Map();
    private onShutdownHandlers: (() => void)[] | null = null;

    constructor(messagePort: MessagePort) {
        this.messagePort = messagePort;
    }

    withEventManager(eventManager: IEventManager<BaseEvent>): WorkerGateway {
        this.eventManager = eventManager;
        return this;
    }

    withLogger(logger: ILogger): WorkerGateway {
        this.logger = logger;
        return this;
    }

    onShutdown(handler: () => void): WorkerGateway {
        if (this.onShutdownHandlers == null) this.onShutdownHandlers = [];
        this.onShutdownHandlers.push(handler);
        return this;
    }

    build(): WorkerGateway {
        if (this.eventManager == null) throw new Error("EventManager not set!");

        this.messagePort.on("message", (msg: AnyEngineCommand) => {
            const handlerSet = this.handlers.get(msg.type);
            if (handlerSet) {
                handlerSet.forEach(h => h(msg.payload));
            }
        });

        this.messagePort.on("close", () => {
            if (this.onShutdownHandlers != null) this.onShutdownHandlers.forEach(h => h());
        });

        this.setupAutomaticMessageBinding();

        return this;
    }

    on<k extends CommandType>(type: k, handler: (payload: IWorkerCommands[k]) => void): this {
        if (!this.handlers.has(type)) this.handlers.set(type, new Set());
        this.handlers.get(type)!.add(handler as (payload: any) => void);
        return this;
    }

    send<k extends EventType>(type: k, payload: IWorkerEvents[k]): void {
        this.messagePort.postMessage({ type, payload });
    }

    private handleShutdown() {
        if (this.onShutdownHandlers != null) {
            this.onShutdownHandlers.forEach(h => h());
        }

        process.exit(0);
    }

    private setupAutomaticMessageBinding() {
        this.on(THREAD_MESSAGES.STOP_THREAD, (payload) => {
           this.logger?.info("Received stop thread message, shutting down...");

           this.handleShutdown();
        });
    }
}