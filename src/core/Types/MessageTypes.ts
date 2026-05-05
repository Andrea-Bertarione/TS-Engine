import {IMessageRegistry} from "../interfaces/IMessageRegistry";

export type MessageType = keyof IMessageRegistry;

export type AnyEngineMessage = {
    [K in MessageType]: { type: K; payload: IMessageRegistry[K] };
}[MessageType];