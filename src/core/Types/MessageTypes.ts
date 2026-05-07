import {IWorkerCommands, IWorkerEvents} from "../interfaces/IMessageRegistry";

export type CommandType = keyof IWorkerCommands;
export type EventType = keyof IWorkerEvents;

export type AnyEngineEvent = { [K in EventType]: { type: K; payload: IWorkerEvents[K] } }[EventType];
export type AnyEngineCommand = { [K in CommandType]: { type: K; payload: IWorkerCommands[K] } }[CommandType];