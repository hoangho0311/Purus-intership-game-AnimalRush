import * as pc from "playcanvas";
import { State } from "./State";

export class RunState extends State {
    enter() {
        this.character.playAnimation(this.character.assets.charRunAnimationAsset, 0.1, true, 1);
    }

    update(dt: number) {
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

        if ((this.character.app.keyboard.wasPressed(pc.KEY_SPACE) || this.character.inputHandler.deltaY < -400) && this.character.isGrounded) {
            this.character.changeState("jump");
        }
    }

    exit() {}
}
