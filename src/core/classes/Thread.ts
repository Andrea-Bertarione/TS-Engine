import {IThread} from "../interfaces/IThread";

export class Thread implements IThread {
    id: string;
    name: string;
    ticks: number;
    currentTick: number;
    running: boolean;

    private delta: number;

    private taskList: Set<() => void>;
    private readonly scheduledTasks: Set<() => void>;
    private scheduledTasksEveryFrame: Map<string, {every: number, callback: () => void}>;

    public constructor(id: string, name: string, ticks: number) {
        this.id = id;
        this.name = name;
        this.ticks = ticks;
        this.currentTick = 0;
        this.running = false;

        this.delta = 0;

        this.taskList = new Set();
        this.scheduledTasks = new Set();
        this.scheduledTasksEveryFrame = new Map();
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

    // Schedule a task to run every x ticks, default every frame
    public scheduleEvery(id: string, callback: () => void, interval: number = 1): void {
        this.scheduledTasksEveryFrame.set(id, { every: interval, callback });
    }

    public removeEvery(id: string): void {
        this.scheduledTasksEveryFrame.delete(id);
    }

    public stop(): void {
        this.running = false;
        this.taskList.clear();
        this.scheduledTasks.clear();
        this.scheduledTasksEveryFrame.clear();
    }

    public getDelta(): number {
        return this.delta;
    }

    private async waitNextTick(frameStart: number): Promise<number> {
        const targetMs = 1000 / this.ticks;
        const timeSpent = Date.now() - frameStart;
        const sleepTime = targetMs - timeSpent;

        this.currentTick++;
        if (this.currentTick >= this.ticks) this.currentTick = 0;

        if (sleepTime > 0) {
            await new Promise(resolve => setTimeout(resolve, sleepTime));
            return Date.now() - frameStart;
        }

        return 0;
    }

    private prepareTick(): void {
        const currentTickTasks: (() => void)[] = [];

        for (const { every, callback } of this.scheduledTasksEveryFrame.values()) {
            if (this.currentTick % every === 0) {
                currentTickTasks.push(callback);
            }
        }

        this.taskList = new Set([...this.scheduledTasks, ...currentTickTasks]);
        this.scheduledTasks.clear();
    }
}