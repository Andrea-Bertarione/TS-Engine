import {MessagePort} from "worker_threads";
import {EventManager} from "../EventManager";
import {ILogger} from "../../interfaces/ILogger";
import {GatewayHandler} from "../../Types/GatewayTypes";
import {AnyEngineMessage, MessageType} from "../../Types/MessageTypes";
import {IMessageRegistry} from "../../interfaces/IMessageRegistry";

// Builter pattern + DependencyInjection
export class WorkerGateway {
    messagePort: MessagePort;

    eventManager: EventManager | null = null;
    logger: ILogger | null = null;

    private handlers: Map<AnyEngineMessage["type"], Set<GatewayHandler>> = new Map();
    private onShutdownHandlers: (() => void)[] | null = null;

    constructor(messagePort: MessagePort) {
        this.messagePort = messagePort;
    }

    withEventManager(eventManager: EventManager): WorkerGateway {
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

        this.messagePort.on("message", (msg: AnyEngineMessage) => {
            const handlerSet = this.handlers.get(msg.type);
            if (handlerSet) {
                handlerSet.forEach(h => h(msg.payload));
            }
        });

        this.messagePort.on("close", () => {
            if (this.onShutdownHandlers != null) this.onShutdownHandlers.forEach(h => h());
        });

        return this;
    }

    on<k extends MessageType>(type: k, handler: (payload: IMessageRegistry[k]) => void): this {
        if (!this.handlers.has(type)) this.handlers.set(type, new Set());
        this.handlers.get(type)!.add(handler as (payload: any) => void);
        return this;
    }

    send<k extends MessageType>(type: k, payload: IMessageRegistry[k]): void {
        this.messagePort.postMessage({ type, payload });
    }

}