import {THREAD_DATA, threadPool} from "../index";
import {WORLD_MESSAGES} from "../core/enums/WorldMessages";

const worldThread = threadPool[THREAD_DATA.world.id];

if (!worldThread) throw new Error("worldThread is undefined");

worldThread.registerListener(WORLD_MESSAGES.WORLD_LOADED, (payload) => {
   console.log("Success: World loaded: " + payload.name);
});

worldThread.sendMessage(WORLD_MESSAGES.WORLD_CREATE, {name: "Test World"});
worldThread.sendMessage(WORLD_MESSAGES.WORLD_LOAD, {name: "Test World"});