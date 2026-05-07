import {BaseEvent} from "../classes/Event";
import {EventConstructor} from "../managers/events/EventManager";
import {ThreadEvent} from "../classes/events/ThreadEvent";
import {CommandType} from "../Types/MessageTypes";

export interface IEventManager<T extends BaseEvent> {
    emit<E extends T>(event: E): void;
    subscribe<E extends T>(eventClass: EventConstructor<E>, callback: (event: E) => void): void;
}

export type IGenericEventManager = IEventManager<BaseEvent> | IEventManager<ThreadEvent<CommandType>>;