import * as pc from "playcanvas";
import { State } from "./State";

export class IdleState extends State {
    enter() {
        console.log("Entering Idle State");
        this.character.playAnimation(this.character.assets.charIdleAnimationAsset, 0.1, true, 1);
    }

    update(dt: number) {
        const keyboard = this.character.app.keyboard;

        if (keyboard.isPressed(pc.KEY_W)) {
            console.log("click")
            this.character.changeState("run");
        }
    }

    exit() {
        console.log("Exiting Idle State");
    }
}
