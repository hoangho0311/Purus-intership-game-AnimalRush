import * as pc from "playcanvas";
import { State } from "./State";

export class RunState extends State {
    enter() {
        console.log("Entering Run State");
        this.character.playAnimation(this.character.assets.charRunAnimationAsset, 0.1, true, 1);
    }

    update(dt: number) {
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

        if (keyboard.wasPressed(pc.KEY_SPACE) && this.character.isGrounded) {
            this.character.changeState("jump");
        }
    }

    exit() {
        console.log("Exiting Run State");
    }
}
