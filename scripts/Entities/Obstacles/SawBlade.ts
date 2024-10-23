import * as pc from "playcanvas";
import { Obstacle } from "../Obstacle";
export class SawBlade extends Obstacle {
    rotationSpeed: number;

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
            
        });
    }
}
