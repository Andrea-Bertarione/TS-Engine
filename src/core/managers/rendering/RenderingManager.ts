import glfw, {Document} from 'glfw-raub';
import Image from 'image-raub';
import Webgl from 'webgl-raub';
import {ILogger} from "../../interfaces/ILogger";

export class RenderingManager {
    document: Document;
    logger?: ILogger;
    shutdownCallback?: () => void;
    private stopLoop?: () => void;

    constructor(title: string, width: number, height: number, vsync: boolean) {
        Document.setImage(Image);
        Document.setWebgl(Webgl);
        this.document = new Document({ title, width, height, vsync });
    }

    withLogger(logger: ILogger): RenderingManager {
        this.logger = logger;
        return this;
    }

    withShutdown(shutdownCallback: () => void): this {
        this.shutdownCallback = shutdownCallback;
        return this;
    }

    loop(onFrame: (delta: number) => void) {
        let last = Date.now();
        let closing = false;

        this.stopLoop = this.document.loop((now) => {
            if (closing) return;

            if (this.document.shouldClose || this.document.getKey(glfw.KEY_ESCAPE)) {
                closing = true;

                this.stop()
                if (this.shutdownCallback) this.shutdownCallback();
                return;
            }

            const delta = now - last;
            last = now;

            onFrame(delta);
        });
    }

    stop() {
        this.stopLoop?.();
        this.document.destroy();

        this.logger?.info("Graceful shutdown initiated")
    }
}