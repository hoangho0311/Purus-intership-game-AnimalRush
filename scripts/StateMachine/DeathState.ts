import * as pc from "playcanvas";
import { State } from "./State";

export class DeathState extends State {
    enter() {
        this.character.playAnimation(this.character.assets.charDeathAnimationAsset, 0, false, 1.5);
        this.character.isPlayerDead = true;
    }

    update(dt: number) {
        
    }

    exit() {
        this.character.isPlayerDead = false;
    }
}
