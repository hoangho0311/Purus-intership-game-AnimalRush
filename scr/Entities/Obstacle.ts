import * as pc from "playcanvas";
import { GameManager } from "../Manager/GameManager";
import { UIManager } from "../Manager/UIManager";

export class Obstacle {
  app: pc.Application;
  entity: pc.Entity;
  asset: pc.Asset;
  position: pc.Vec3;
  scale: pc.Vec3;
  collisionConfig: any;
  gameManager: GameManager;
  uiManager: UIManager;

  constructor(
    app: pc.Application,
    asset: pc.Asset,
    position: pc.Vec3,
    scale: pc.Vec3,
    collisionConfig: any
  ) {
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
    // this.showCollisionBounds();
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
      restitution: 0.5,
    });

    this.entity.addComponent("collision", {
      type: this.collisionConfig.type,
      halfExtents: this.collisionConfig.halfExtents,
      radius: this.collisionConfig.radius,
      linearOffset: this.collisionConfig.linearOffset || new pc.Vec3(0, 0, 0),
    });

    this.entity.collision!.on(
      "collisionstart",
      this.onCollisionStart.bind(this)
    );
  }

  onCollisionStart(result: pc.ContactResult) {
    if (result.other.tags.has("player")) {
      const character = result.other.script?.characterInstance;
      if (!character.isPlayerDead) {
        this.gameManager.endGame();
        character.changeState("death");
        setTimeout(() => {
          this.app.fire("UI:OpenLoseGame");
        }, 1300);
      }
    }
  }

  setupBehavior() {}

  showCollisionBounds() {
    const colliderBox = new pc.Entity("ColliderBox");

    colliderBox.addComponent("model", {
      type: "box",
    });

    colliderBox.setLocalScale(1.7, 1.7, 1.7);

    colliderBox.setLocalPosition(0, -4, 0);

    const material = new pc.StandardMaterial();
    material.diffuse = new pc.Color(1, 0, 0);
    material.opacity = 0.5;
    material.blendType = pc.BLEND_NORMAL;
    material.update();

    colliderBox.model!.meshInstances[0].material = material;

    this.entity.addChild(colliderBox);
  }
}
