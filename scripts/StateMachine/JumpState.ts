import * as pc from "playcanvas";
import { State } from "./State";

export class JumpState extends State {
    private jumpTime: number = 0;
    enter() {
        console.log("Entering Jump State");
        this.jumpTime = 0;
        this.character.isJumpping = true;
        this.character.isGrounded = false;
        this.character.playAnimation(this.character.assets.charJumpAnimationAsset, 0, false, 1.5);
    
        const velocity = this.character.entity.rigidbody!.linearVelocity.clone();
        const jumpImpulse = new pc.Vec3(0, 200, 0);
        velocity.x = 0;
        velocity.y = 0;
        this.character.entity.rigidbody!.linearVelocity = velocity;
        this.character.entity.rigidbody!.applyImpulse(jumpImpulse);
    }

    update(dt: number) {
        this.jumpTime += dt; 
        if (this.jumpTime > 0.5 && this.checkIfGrounded()) {
            console.log("Character has landed.");
            this.character.isGrounded = true;
            this.character.changeState("run");
        }

        const keyboard = this.character.app.keyboard;
        const velocity = this.character.entity.rigidbody!.linearVelocity.clone();
        
        const charSpeed = 20;
        const position = this.character.entity.getPosition();

        const minX = -4;
        const maxX = 4;

        if (keyboard.isPressed(pc.KEY_A) && position.x < maxX) {
            velocity.x += charSpeed * dt;
        }
        else if (keyboard.isPressed(pc.KEY_D) && position.x > minX) {
            velocity.x -= charSpeed * dt;
        }else{
            velocity.x = 0;
        }

        if(position.x == maxX || position.x == minX){
            velocity.x =0;
        }

        this.character.entity.rigidbody!.linearVelocity = velocity;
    }

    exit() {
        this.character.isJumpping = false;
    }

    checkIfGrounded(): boolean {
        const rayOrigin = this.character.entity.getPosition().clone();
        rayOrigin.y += 0.2;
    
        const rayEnd = new pc.Vec3(rayOrigin.x, rayOrigin.y - 1.0, rayOrigin.z);
    
        const results = this.character.app.systems.rigidbody!.raycastAll(rayOrigin, rayEnd);
    
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
    
        return minDistance <= 0.3;
      }
}
