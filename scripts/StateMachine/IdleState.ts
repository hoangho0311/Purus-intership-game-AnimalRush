import * as pc from "playcanvas";
import { State } from "./State";
import { GameManager } from "../Manager/GameManager";

export class IdleState extends State {
    enter() {
        this.character.playAnimation(this.character.assets.charIdleAnimationAsset, 0.1, true, 1);
    }

    update(dt: number) {
        const keyboard = this.character.app.keyboard;
        const gameManager = GameManager.getInstance();

        if (keyboard.isPressed(pc.KEY_W) || this.character.startX !=0) {
            gameManager.startGame();
            this.character.changeState("run");
        }
    }

    exit() {
    }
}
