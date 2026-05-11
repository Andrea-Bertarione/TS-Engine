import glfw, {Document} from 'glfw-raub';
import Image from 'image-raub';
import Webgl from 'webgl-raub';

export class RenderingManager {
    document: Document;

    constructor(title: string, width: number, height: number, vsync: boolean) {
        Document.setImage(Image);
        Document.setWebgl(Webgl);
        this.document = new Document({ title, width, height, vsync });
    }

    loop(onFrame: (delta: number) => void, onClose: () => void) {
        let last = Date.now();

        this.document.loop((now) => {
            const delta = now - last;
            last = now;

            if (this.document.shouldClose || this.document.getKey(glfw.KEY_ESCAPE)) {
                onClose();
                return;
            }

            onFrame(delta);
        });
    }
}