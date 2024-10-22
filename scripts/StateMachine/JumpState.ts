import * as pc from "playcanvas";
import { State } from "./State";

export class JumpState extends State {
    private jumpTime: number = 0;

    enter() {
        this.jumpTime = 0;
        this.character.isJumpping = true;
        this.character.isGrounded = false;
        this.character.playAnimation(this.character.assets.charJumpAnimationAsset, 0, false, 1.3);

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
            this.character.isGrounded = true;
            this.character.changeState("run");
        }

        const charSpeed = 15;
        const minX = -5;
        const maxX = 5;

        const direction = this.character.inputHandler.getMovementDirection(dt, charSpeed, minX, maxX);

        const position = this.character.entity.getPosition();
        if (!this.character.inputHandler.isTouching) {
            position.x += direction;
        }
        
        const deltaX = this.character.inputHandler.getMovementDelta();

        position.x += -deltaX * 0.01; 
        position.x = pc.math.clamp(position.x, minX, maxX); 

        this.character.entity.rigidbody!.teleport(position);
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
