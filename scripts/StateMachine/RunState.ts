import * as pc from "playcanvas";
import { State } from "./State";
import { AssetManager } from "../Manager/AssetManager";
import { SafeKeyAsset } from "../Helper/SafeKeyAsset";
export class RunState extends State {
    enter() {
        const assetManager = AssetManager.getInstance();
        const charRunAnimationAsset = assetManager.getAsset(SafeKeyAsset.CharRunAnimationAsset);
        this.character.playAnimation(charRunAnimationAsset!, 0, true, 1);
        this.character.isGrounded = true;
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

        position.x += -deltaX * this.character.inputHandler.touchSpeed; 
        position.x = pc.math.clamp(position.x, minX, maxX); 
 
        this.character.entity.rigidbody!.teleport(position);

        if ((this.character.app.keyboard.wasPressed(pc.KEY_SPACE) || this.character.inputHandler.deltaY < -300) && this.character.isGrounded) {
            this.character.changeState("jump");
        }
    }

    exit() {}
}
