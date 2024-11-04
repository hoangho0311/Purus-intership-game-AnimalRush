import * as pc from "playcanvas";
import { Obstacle } from "../Obstacle";
export class SpinHammer extends Obstacle {
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
            const angle = this.rotationSpeed * dt;
            this.entity.rotate(0, angle , 0);
        });
    }
}
