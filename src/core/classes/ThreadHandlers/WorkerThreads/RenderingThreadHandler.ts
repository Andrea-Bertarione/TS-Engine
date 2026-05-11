import {IRenderingThreadHandler, IWorldThreadHandler} from "../../../interfaces/IThreadHandler";
import {WorldManager} from "../../../managers/WorldManager";
import {WorkerThreadHandler} from "../WorkerThreadHandler";
import {EventManager} from "../../../managers/events/EventManager";
import {RenderingManager} from "../../../managers/rendering/RenderingManager";

//This thread handler requires a certain order to build, will make a specific builder sooner or later
export class RenderingThreadHandler extends WorkerThreadHandler implements IRenderingThreadHandler {
    renderingManager?: RenderingManager;
    width: number = 900;
    height: number = 600;
    title: string = "Rendering Windows";
    vsync: boolean = false;

    onPageClose?: () => void;

    withRenderingManager(): this {
        this.renderingManager = new RenderingManager(this.title, this.width, this.height, this.vsync);
        return this;
    }

    withWidth(width: number): this {
        this.width = width;
        return this;
    }

    withHeight(height: number): this {
        this.height = height;
        return this;
    }

    withTitle(title: string): this {
        this.title = title;
        return this;
    }

    withVsync(vsync: boolean): this {
        this.vsync = vsync;
        return this;
    }

    build(): this {
        if (this.renderingManager == null) throw new Error("RenderingManger not set!");


        this.thread?.startExternal();

        this.renderingManager.loop((delta) => {
            this.thread!.runSingleTick(delta);
        }, () => {
            if (this.onPageClose != null) this.onPageClose();

            this.thread!.stop();
        });

        return super.build();
    }
}