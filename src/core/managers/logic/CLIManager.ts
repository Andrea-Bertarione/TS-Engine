import {IThread} from "../../interfaces/IThread";

export class CLIManager {
    startCLI(thread: IThread): void {
        //Schedule the CLI handler every 30 ticks
        thread.scheduleEvery("CLI", () => {
            console.log("CLI");
        }, 30);
    }
}