import {mainThreadHandler} from "../index";
import {WORLD_MESSAGES} from "../core/enums/WorldMessages";
import {onWorldStart} from "../core/classes/events/localEvents/onWorldStart";
import {ShutdownEvent} from "../core/classes/events/threadEvents/shutdown";

const worldThread = mainThreadHandler.threadPool?.world;

if (!worldThread) throw new Error("worldThread is undefined");

worldThread.registerListener(WORLD_MESSAGES.WORLD_LOADED, (payload) => {
   console.log("Success: World loaded: " + payload.name);
});

worldThread.sendMessage(WORLD_MESSAGES.WORLD_CREATE, {name: "Test World"});
worldThread.sendMessage(WORLD_MESSAGES.WORLD_LOAD, {name: "Test World"});