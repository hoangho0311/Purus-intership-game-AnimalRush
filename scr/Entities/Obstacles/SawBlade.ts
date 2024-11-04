import * as pc from "playcanvas";
import { Obstacle } from "../Obstacle";
import { GameManager } from "../../Manager/GameManager";

export class SawBlade extends Obstacle {
    rotationSpeed: number;
    collider2: pc.Entity;

    constructor(
        app: pc.Application,
        asset: pc.Asset,
        position: pc.Vec3,
        scale: pc.Vec3,
        collisionConfig: any,
        rotationSpeed: number
    ) {
        super(app, asset, position, scale, collisionConfig);

        this.rotationSpeed = rotationSpeed;
    }

    setupBehavior() {
        this.app.on("update", (dt) => {
            if(GameManager.getInstance().isPaused() || GameManager.getInstance().isOver() ) return;
            const angle = this.rotationSpeed * dt;
            this.entity.rotate(angle, 0, 0);
        });
    }
}
