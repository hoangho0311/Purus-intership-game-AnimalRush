import * as pc from "playcanvas";
import { State } from "./State";
import { SafeKeyAsset } from "../Helper/SafeKeyAsset";

export class IdleState extends State {
    enter() {
        const charIdleAnimation = this.character.assetManager.getAsset(SafeKeyAsset.CharIdleAnimationAsset);
        this.character.playAnimation(charIdleAnimation!, 0.1, true, 1);
    }

    update(dt: number) {
    }

    exit() {
        console.log("Exiting Idle State");
    }
}
