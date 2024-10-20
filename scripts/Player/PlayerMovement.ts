import * as pc from "playcanvas";
import { Debug } from "playcanvas/build/playcanvas/src/core/debug.js";

export class PlayerMovement {
  entity: pc.Entity;
  assets: any;
  app: pc.Application;
  currentAnim: string;
  isGrounded: boolean;
  isJumpping: boolean;
  jumpCooldown: number;

  constructor(app: pc.Application, assets: any) {
    this.app = app;
    this.assets = assets;
    this.entity = new pc.Entity("Character");
    this.jumpCooldown = 0;
    this.isGrounded = false;
    this.isJumpping = false;
    this.currentAnim = assets.charRunAnimationAsset.name;

    // Add model and animation components
    this.entity.addComponent("model", {
      type: "asset",
      asset: assets.charModelAsset,
    });

    this.entity.addComponent("animation", {
      assets: [
        assets.charIdleAnimationAsset,
        assets.charRunAnimationAsset,
        assets.charJumpAnimationAsset,
      ],
    });

    // Scale and position the character
    const scale = 0.2;
    this.entity.setLocalScale(scale, scale, scale);
    this.entity.setPosition(0, 5, 0);

    // Apply materials to the model's mesh instances
    this.applyMaterials();

    // Add rigidbody and collision components
    this.entity.addComponent("rigidbody", {
      type: "dynamic",
      mass: 30,
      restitution: 0.5,
    });

    this.entity.addComponent("collision", {
      type: "box",
      halfExtents: [1, 2, 1.5],
      linearOffset: new pc.Vec3(0, 2, 1.5),
    });

    this.entity.rigidbody!.angularFactor = new pc.Vec3(0, 0, 0);

    app.root.addChild(this.entity);
    this.playAnimation(assets.charRunAnimationAsset, 0, true, 1);
  }

  applyMaterials() {
    const materialGreen = new pc.StandardMaterial();
    materialGreen.diffuse = new pc.Color(0.3, 0.33, 0.29);
    materialGreen.update();

    const materialBlack = new pc.StandardMaterial();
    materialBlack.diffuse = new pc.Color(0.09, 0.09, 0.09);
    materialBlack.update();

    const materialLightGreen = new pc.StandardMaterial();
    materialLightGreen.diffuse = new pc.Color(0.57, 0.56, 0.43);
    materialLightGreen.update();

    const materialRed = new pc.StandardMaterial();
    materialRed.diffuse = new pc.Color(0.58, 0.27, 0.3);
    materialRed.update();

    const materialLightYellow = new pc.StandardMaterial();
    materialLightYellow.diffuse = new pc.Color(0.8, 0.64, 0.41);
    materialLightYellow.update();

    const meshInstances = this.entity.model!.meshInstances;
    if (meshInstances.length >= 5) {
      meshInstances[0].material = materialGreen;
      meshInstances[1].material = materialBlack;
      meshInstances[2].material = materialLightGreen;
      meshInstances[3].material = materialRed;
      meshInstances[4].material = materialLightYellow;
    }
  }

  moveCharacter(keyboard: pc.Keyboard, charSpeed: number, dt: number) {
    const velocity = this.entity.rigidbody!.linearVelocity.clone();
    this.isGrounded = this.checkIfGrounded();
    velocity.x = 0;
    const MAX_SPEED = 100;
    velocity.z = Math.min(velocity.z + charSpeed * dt, MAX_SPEED);
    const position = this.entity.getPosition();

    const minX = -4;
    const maxX = 4;

    if (keyboard.isPressed(pc.KEY_A) && position.x < maxX) {
      velocity.x += charSpeed * 100 * dt;
    }
    if (keyboard.isPressed(pc.KEY_D) && position.x > minX) {
      velocity.x -= charSpeed * 100 * dt;
    }

    this.entity.rigidbody!.linearVelocity = velocity;

    // Jump logic
    if (
      keyboard.wasPressed(pc.KEY_SPACE) &&
      this.isGrounded &&
      !this.isJumpping
    ) {
      this.playAnimation(this.assets.charJumpAnimationAsset, 0, false, 1.5);
      this.isJumpping = true;
      this.isGrounded = false;
      this.jumpCooldown = 0.5;

      setTimeout(() => {
        velocity.y = 0;
        const jumpImpulse = new pc.Vec3(0, 250, 0);
        this.entity.rigidbody!.linearVelocity = velocity;
        this.entity.rigidbody!.applyImpulse(jumpImpulse);
      }, 200);
    }

    if (this.isJumpping) {
      this.jumpCooldown += dt;
    }

    if (this.isGrounded && this.isJumpping && this.jumpCooldown >= 1) {
      this.isJumpping = false;

      if (this.currentAnim !== this.assets.charRunAnimationAsset.name) {
        this.playAnimation(this.assets.charRunAnimationAsset, 0.1, true, 1);
      }
    }
  }

  // Function to switch animations
  playAnimation(
    animationAsset: any,
    transitionTime: number,
    loop: boolean,
    speed: number
  ) {
    if (this.entity.animation) {
      this.entity.animation.play(animationAsset.name, transitionTime);
      this.entity.animation.loop = loop;
      this.entity.animation.speed = speed;
      this.currentAnim = animationAsset.name;
    }
  }

  checkIfGrounded(): boolean {
    const rayOrigin = this.entity.getPosition().clone();
    rayOrigin.y += 0.2;

    const rayEnd = new pc.Vec3(rayOrigin.x, rayOrigin.y - 1.0, rayOrigin.z);

    const results = this.app.systems.rigidbody!.raycastAll(rayOrigin, rayEnd);

    let minDistance = Infinity;

    for (let i = 0; i < results.length; i++) {
      if (results[i].entity.tags.has("ground")) {
        const hitPoint = results[i].point;
        const distance = rayOrigin.distance(hitPoint);

        if (distance < minDistance) {
          minDistance = distance;
        }
      }
    }

    return minDistance <= 0.5;
  }

}
