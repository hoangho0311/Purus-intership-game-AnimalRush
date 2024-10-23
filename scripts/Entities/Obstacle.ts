import * as pc from "playcanvas";
import { GameManager } from "../Manager/GameManager";

export class Obstacle {
    app: pc.Application;
    entity: pc.Entity;
    asset: pc.Asset;
    position: pc.Vec3;
    scale: pc.Vec3;
    collisionConfig: any;
    gameManager: GameManager

    constructor(app: pc.Application, asset: pc.Asset, position: pc.Vec3, scale: pc.Vec3, collisionConfig: any) {
        this.app = app;
        this.asset = asset;
        this.position = position;
        this.scale = scale;
        this.collisionConfig = collisionConfig;
        this.entity = new pc.Entity("Obstacle");
        this.gameManager = GameManager.getInstance();

        this.setupModel();
        this.setupCollision();
        this.setupBehavior();
        //this.showCollisionBounds();

    }

    setupModel() {
        this.entity.addComponent("model", {
            type: "asset",
            asset: this.asset,
        });

        this.entity.setLocalScale(this.scale);
        this.entity.setLocalPosition(this.position);
    }

    setupCollision() {
        this.entity.addComponent("rigidbody", {
            type: "static",
            restitution: 0.5
        }); 

        this.entity.addComponent("collision", {
            type: this.collisionConfig.type,
            halfExtents: this.collisionConfig.halfExtents,
            radius: this.collisionConfig.radius,
            linearOffset: this.collisionConfig.linearOffset || new pc.Vec3(0, 0, 0)
        });
    }

    setupBehavior() {
    }
    
    showCollisionBounds() {
        const colliderBox = new pc.Entity("ColliderBox");
    
        colliderBox.addComponent("model", {
            type: "box"
        });
    
        colliderBox.setLocalScale(0.8, 2, 0.8);
    
        colliderBox.setLocalPosition(0, 1, 0);
    
        const material = new pc.StandardMaterial();
        material.diffuse = new pc.Color(1, 0, 0);
        material.opacity = 0.5;
        material.blendType = pc.BLEND_NORMAL;
        material.update();
    
        colliderBox.model!.meshInstances[0].material = material;
    
        this.entity.addChild(colliderBox);
    }
}
