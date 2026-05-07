import {BaseEvent} from "../classes/Event";
import {EventConstructor} from "../managers/events/EventManager";

export interface IEventManager<T extends BaseEvent> {
    emit<E extends T>(event: E): void;
    subscribe<E extends T>(eventClass: EventConstructor<E>, callback: (event: E) => void): void;
}