import * as pc from "playcanvas";
import { Obstacle } from "../Obstacle";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { GameManager } from "../../Manager/GameManager";

export class Hammer extends Obstacle {
    rotationSpeed: number;
    swingAngle: number;
    swingSpeed: number;
    swingDirection: number;

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
        this.swingAngle = 0;
        this.swingSpeed = 60;
        this.swingDirection = 1;
    }

    setupBehavior() {
        this.app.on("update", (dt) => {
            if(GameManager.getInstance().isPaused() || GameManager.getInstance().isOver() ) return;
            this.swingAngle += this.swingSpeed * dt * this.swingDirection;

            if (this.swingAngle > 45 || this.swingAngle < -45) {
                this.swingDirection *= -1;
            }

            this.entity.setEulerAngles(this.swingAngle, 90, 0);
        });
    }
}
