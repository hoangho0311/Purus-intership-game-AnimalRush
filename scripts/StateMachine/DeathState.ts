import * as pc from "playcanvas";
import { State } from "./State";
import { SafeKeyAsset } from "../Helper/SafeKeyAsset";
export class DeathState extends State {
    enter() {
        this.character.soundManager.stopSoundByKey(SafeKeyAsset.BackGroundMusic);
        this.character.soundManager.playSoundByKey(SafeKeyAsset.LoseGameSoundEffect);
        const charDeathAnimationAsset = this.character.assetManager.getAsset(SafeKeyAsset.CharDeathAnimationAsset);
        this.character.playAnimation(charDeathAnimationAsset!, 0, false, 1.5);
        this.character.isPlayerDead = true;
    }

    update(dt: number) {
        
    }

    exit() {
        this.character.isPlayerDead = false;
    }
}
