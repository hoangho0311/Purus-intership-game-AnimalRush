import * as pc from "playcanvas";
import { State } from "./State";

export class RunState extends State {
    enter() {
        this.character.playAnimation(this.character.assets.charRunAnimationAsset, 0.1, true, 1);
    }

    update(dt: number) {
        const keyboard = this.character.app.keyboard;
        const touchX = this.character.inputHandler.startX;
        const charSpeed = 15;
        const position = this.character.entity.getPosition();

        const minX = -4;
        const maxX = 4;

        if (keyboard.isPressed(pc.KEY_A) && position.x > minX) {
            position.x += charSpeed * dt;
        } else if (keyboard.isPressed(pc.KEY_D) && position.x < maxX) {
            position.x -= charSpeed * dt;
        }

        if (this.character.inputHandler.isTouching) {
            const screenWidth = this.character.app.graphicsDevice.width;
            const normalizedTouchX = (touchX / screenWidth) * 2 - 1; 
            const newPosX = normalizedTouchX * maxX; 

            const clampedPosX = pc.math.clamp(newPosX, minX, maxX);

            this.character.entity.rigidbody!.teleport(new pc.Vec3(-clampedPosX, position.y, position.z));
        }

        this.character.entity.rigidbody!.teleport(position);

        if ((keyboard.wasPressed(pc.KEY_SPACE) || this.character.inputHandler.deltaY < -500) && this.character.isGrounded) {
            this.character.changeState("jump");
        }
    }

    exit() {
    }
}
