import * as pc from "playcanvas";
import { Obstacle } from "../Obstacle";
import { GameManager } from "../../Manager/GameManager";

export class Spindle extends Obstacle {
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

    onCollisionStart(result: pc.ContactResult) {
        if (result.other.tags.has('player')) {
        const character = result.other.script?.characterInstance;
            if (!character.isPlayerDead) {
                this.gameManager.endGame();
                character.changeState('death');
                setTimeout(() => {
                    this.app.fire("UI:OpenLoseGame");
                }, 1300);
            }
        }
    }

    setupBehavior() {
        const collider2 =  new pc.Entity("collider2");
        collider2.addComponent("model", {
            type: "box"
        });
        collider2.addComponent("rigidbody", {
            type: "static",
            restitution: 0.5
        }); 

        collider2.addComponent("collision", {
            type: "box",
            halfExtents: new pc.Vec3(0.5, 0.6, 12),
            linearOffset: new pc.Vec3(0, 1.5, 0)
        });
        this.entity.addChild(collider2)
        collider2.collision!.on('collisionstart', this.onCollisionStart.bind(this));

        this.app.on("update", (dt) => {
            if(GameManager.getInstance().isPaused() || GameManager.getInstance().isOver() ) return;
            const angle = this.rotationSpeed * dt;
            this.entity.rotate(0, angle , 0);
            if(collider2.rigidbody)
                collider2.rigidbody!.teleport(collider2.getPosition());
        });
    }
}
