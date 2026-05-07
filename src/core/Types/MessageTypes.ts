import {IMessageRegistry, IWorkerCommands, IWorkerEvents} from "../interfaces/IMessageRegistry";

export type MessageType = keyof IMessageRegistry;
export type CommandType = keyof IWorkerCommands;
export type EventType = keyof IWorkerEvents;

export type AnyEngineMessage = {
    [K in MessageType]: { type: K; payload: IMessageRegistry[K] };
}[MessageType];