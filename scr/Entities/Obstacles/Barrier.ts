import * as pc from "playcanvas";
import { Obstacle } from "../Obstacle";
export class Barrier extends Obstacle {
    constructor(
        app: pc.Application,
        asset: pc.Asset,
        position: pc.Vec3,
        scale: pc.Vec3,
        collisionConfig: any
    ) {
        super(app, asset, position, scale, collisionConfig);
    }

    setupBehavior() {
    }
}
