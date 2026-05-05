export interface IThread {
    id: string;
    name: string;
    ticks: number;
    running: boolean;

    start(): void;
    schedule(callback: () => void): void;
    stop(): void;

    getDelta(): number;
}