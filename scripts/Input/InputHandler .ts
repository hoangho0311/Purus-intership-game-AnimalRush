import * as pc from "playcanvas";

export class InputHandler {
    app: pc.Application;
    isTouching: boolean;
    startX: number;
    startY: number;
    deltaY: number;

    constructor(app: pc.Application) {
        this.app = app;
        this.isTouching = false;
        this.startX = 0;
        this.startY = 0;
        this.deltaY = 0;

        this.setupTouchEvents();
    }

    setupTouchEvents() {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);

        this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);

        this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
    }

    onTouchStart(event: pc.TouchEvent) {
        this.isTouching = true;
        const touch = event.touches[0];
        this.startX = touch.x;
        this.startY = touch.y;
    }

    onTouchMove(event: pc.TouchEvent) {
        if (this.isTouching) {
            const currentX = event.touches[0].x;
            this.startX = currentX;

            const currentY = event.touches[0].y;
            const deltaY = currentY - this.startY;
            this.deltaY = deltaY;
        }
    }

    onTouchEnd() {
        this.deltaY = 0;
        this.isTouching = false;
    }
}
