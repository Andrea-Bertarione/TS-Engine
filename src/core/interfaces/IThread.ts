export interface IThread {
    id: string;
    name: string;
    ticks: number;
    running: boolean;

    start(): Promise<void>;
    schedule(callback: () => void): void;
    stop(): void;

    startExternal(): void
    runSingleTick(delta: number): void

    getDelta(): number;
}