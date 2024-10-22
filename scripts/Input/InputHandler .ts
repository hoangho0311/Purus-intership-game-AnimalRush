import * as pc from "playcanvas";

export class InputHandler {
    app: pc.Application;
    isTouching: boolean;
    startX: number;
    startY: number;
    deltaY: number;
    deltaX: number;

    constructor(app: pc.Application) {
        this.app = app;
        this.isTouching = false;
        this.startX = 0;
        this.startY = 0;
        this.deltaY = 0;
        this.deltaX = 0;

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
            this.deltaX = currentX - this.startX; 
            this.startX = currentX;

            const currentY = event.touches[0].y;
            this.deltaY = currentY - this.startY;
        }
    }

    getMovementDelta(): number {
        if(this.deltaX !=0)
            return this.deltaX;
        return 0;
    }

    onTouchEnd() {
        this.deltaY = 0;
        this.deltaX = 0;
        this.isTouching = false;
    }

    getMovementDirection(dt: number, speed: number, minX: number, maxX: number): number {
        const keyboard = this.app.keyboard;
        let direction = 0;

        if (keyboard.isPressed(pc.KEY_A)) {
            direction = speed * dt;
        } else if (keyboard.isPressed(pc.KEY_D)) {
            direction = -speed * dt;
        }

        if (this.isTouching) {
            const screenWidth = this.app.graphicsDevice.width;
            const normalizedTouchX = (this.startX / screenWidth) * 2 - 1;
            const targetX = normalizedTouchX * maxX;
            const clampedPosX = pc.math.clamp(targetX, minX, maxX);
            direction = -clampedPosX;
        }

        return direction;
    }
}
