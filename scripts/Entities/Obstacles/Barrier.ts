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

    onCollisionStart(result: pc.ContactResult) {
        if (result.other.tags.has('player')) {
            console.log('Player hit the barrier!');
        }
    }
}
