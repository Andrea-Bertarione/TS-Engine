import {ThreadEvent} from "../ThreadEvent";
import {THREAD_DATA} from "../../../../index";
import {THREAD_MESSAGES} from "../../../enums/ThreadMessages";

export class ShutdownEvent extends ThreadEvent<THREAD_MESSAGES.STOP_THREAD> {
    constructor(reason: string) {
        super(Object.keys(THREAD_DATA), THREAD_MESSAGES.STOP_THREAD, { reason });
    }
}