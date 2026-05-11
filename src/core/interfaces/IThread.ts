export interface IThread {
    id: string;
    name: string;
    ticks: number;
    running: boolean;

    start(): Promise<void>;
    schedule(callback: () => void): void;
    scheduleEvery(id: string, callback: () => void, interval?: number): void;
    stop(): void;

    removeEvery(id: string): void;

    startExternal(): void
    runSingleTick(delta: number): void

    getDelta(): number;
}