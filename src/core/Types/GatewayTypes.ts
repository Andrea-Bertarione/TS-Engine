import {AnyEngineMessage} from "./MessageTypes";

export type GatewayHandler = (payload: AnyEngineMessage["payload"]) => void;