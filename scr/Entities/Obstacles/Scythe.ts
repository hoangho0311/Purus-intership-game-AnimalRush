import * as pc from "playcanvas";
import { Obstacle } from "../Obstacle";
import { GameManager } from "../../Manager/GameManager";

export class Scythe extends Obstacle {
    swingSpeed: number;
    swingAngle: number;
    direction: number;

    constructor(
        app: pc.Application,
        asset: pc.Asset,
        position: pc.Vec3,
        scale: pc.Vec3,
        collisionConfig: any,
        swingSpeed: number
    ) {
        super(app, asset, position, scale, collisionConfig);
        this.swingSpeed = swingSpeed;
        this.swingAngle = 0;
        this.direction = 1;
    }

    setupBehavior() {
        this.app.on("update", (dt) => {
            if(GameManager.getInstance().isPaused() || GameManager.getInstance().isOver() ) return;
            const position = this.entity.getLocalPosition();

            position.x += this.swingSpeed * dt * this.direction;

            if (position.x > 5) {
                position.x = 5;
                this.direction = -1;
            } else if (position.x < -5) {
                position.x = -5;
                this.direction = 1;
            }

            this.entity.setLocalPosition(position);
        });
    }
}
