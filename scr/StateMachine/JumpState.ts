import * as pc from "playcanvas";
import { State } from "./State";
import { SafeKeyAsset } from "../Helper/SafeKeyAsset";

export class JumpState extends State {
  private jumpTime = 0;
  private readonly JUMP_IMPULSE = new pc.Vec3(0, 250, 0);
  private readonly CHAR_SPEED = 15;
  private readonly MIN_X = -4;
  private readonly MAX_X = 4;

  enter() {
    this.jumpTime = 0;
    this.character.isGrounded = false;
    this.character.soundManager.playSoundEffect("jump");
    const jumpAnimation = this.character.assetManager.getAsset(SafeKeyAsset.CharJumpAnimationAsset);
    this.character.playAnimation(jumpAnimation!, 0, false, 1.13);

    this.character.entity.rigidbody!.applyImpulse(this.JUMP_IMPULSE);
  }

  update(dt: number) {
    this.jumpTime += dt;

    if (this.jumpTime > 0.8 && this.checkIfGrounded()) {
      this.character.changeState("run");
      return;
    }

    // this.updateHorizontalPosition(dt);
  }

  exit() {
    this.jumpTime = 0;
    this.resetVerticalVelocity();
  }

  private resetVerticalVelocity() {
    const velocity = this.character.entity.rigidbody!.linearVelocity.clone();
    velocity.y = 0;
    this.character.entity.rigidbody!.linearVelocity = velocity;
  }

  private updateHorizontalPosition(dt: number) {
    const position = this.character.entity.getPosition();
    const direction = this.character.inputHandler.getMovementDirection(dt, this.CHAR_SPEED, this.MIN_X, this.MAX_X);

    if (!this.character.inputHandler.isTouching) {
      position.x -= direction;
    }

    const deltaX = -this.character.inputHandler.getMovementDelta() * this.character.inputHandler.touchSpeed;
    position.x = pc.math.clamp(position.x + deltaX, this.MIN_X, this.MAX_X);

    this.character.entity.rigidbody!.teleport(position);
  }

  private checkIfGrounded(): boolean {
    const rayOrigin = this.character.entity.getPosition().clone().add(new pc.Vec3(0, 1, 0));
    const rayEnd = new pc.Vec3(rayOrigin.x, rayOrigin.y - 1, rayOrigin.z);
    const results = this.character.app.systems.rigidbody!.raycastAll(rayOrigin, rayEnd);
    const minDistance = 0.4;

    return results.some(result => 
      result.entity.tags.has("ground") &&
      rayOrigin.distance(result.point) < minDistance
    );
  }
}
