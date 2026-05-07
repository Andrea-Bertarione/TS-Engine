import {BaseEvent} from "../../classes/Event";
import {IEventManager} from "../../interfaces/IEventManager";

export type EventConstructor<T extends BaseEvent> = new (...args: any[]) => T;
export class EventManager implements IEventManager<BaseEvent> {
    private listeners: Map<EventConstructor<any>, Set<(event: any) => void>> = new Map();

    public subscribe<T extends BaseEvent>(
        eventClass: EventConstructor<T>,
        callback: (event: T) => void
    ): void {
        if (!this.listeners.has(eventClass)) {
            this.listeners.set(eventClass, new Set());
        }
        this.listeners.get(eventClass)!.add(callback);
    }

    public emit<T extends BaseEvent>(event: T): void {
        const eventClass = event.constructor as EventConstructor<T>;
        const callbacks = this.listeners.get(eventClass);

        if (callbacks) {
            callbacks.forEach(callback => callback(event));
        }
    }
}