import {IThread} from "../interfaces/IThread";

export class Thread implements IThread {
    id: string;
    name: string;
    ticks: number;
    running: boolean;

    private delta: number;

    private taskList: Set<() => void>;
    private readonly scheduledTasks: Set<() => void>;

    public constructor(id: string, name: string, ticks: number) {
        this.id = id;
        this.name = name;
        this.ticks = ticks;
        this.running = false;

        this.delta = 0;

        this.taskList = new Set();
        this.scheduledTasks = new Set();
    }

    public async start(): Promise<void> {
        if (this.running) return;
        this.running = true;

        while (this.running) {
            const start = Date.now();
            this.taskList.forEach(task => task());

            this.prepareTick();
            this.delta = await this.waitNextTick(start);
        }
    }

    public startExternal(): void {
        this.running = true;
    }

    public runSingleTick(delta: number): void {
        if (!this.running) return;

        this.delta = delta;
        this.taskList.forEach(task => task());
        this.prepareTick();
    }

    public schedule(callback: () => void): void {
        this.scheduledTasks.add(callback);
    }

    public stop(): void {
        this.running = false;
        this.taskList.clear();
        this.scheduledTasks.clear();
    }

    public getDelta(): number {
        return this.delta;
    }

    private async waitNextTick(frameStart: number): Promise<number> {
        const targetMs = 1000 / this.ticks;
        const timeSpent = Date.now() - frameStart;
        const sleepTime = targetMs - timeSpent;

        if (sleepTime > 0) {
            await new Promise(resolve => setTimeout(resolve, sleepTime));
            return Date.now() - frameStart;
        }

        return 0;
    }

    private prepareTick(): void {
        this.taskList = new Set([...this.scheduledTasks]);
        this.scheduledTasks.clear();
    }
}