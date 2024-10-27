import * as pc from "playcanvas";
import { State } from "./State";
import { GameManager } from "../Manager/GameManager";
import { AssetManager } from "../Manager/AssetManager";
import { SafeKeyAsset } from "../Helper/SafeKeyAsset";

export class IdleState extends State {
    enter() {
        const assetManager = AssetManager.getInstance();
        const charIdleAnimation = assetManager.getAsset(SafeKeyAsset.CharIdleAnimationAsset);
        this.character.playAnimation(charIdleAnimation!, 0.1, true, 1);
    }

    update(dt: number) {
        const keyboard = this.character.app.keyboard;
        const gameManager = GameManager.getInstance();

        if (keyboard.isPressed(pc.KEY_W) || this.character.inputHandler.isTouching) {
            this.character.app.fire("switchLight", "game");
            this.character.app.fire("switchCamera", "game");
            this.character.app.fire("UI:OpenInGame");
            gameManager.startGame();
            this.character.changeState("run");
        }
    }

    exit() {
        console.log("Exiting Idle State");
    }
}
