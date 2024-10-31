import * as pc from "playcanvas";
import { UIButton } from "../Common/UIButton";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { UIManager } from "../../Manager/UIManager";
import { GameManager } from "../../Manager/GameManager";
import * as TWEEN from '@tweenjs/tween.js'

export class TutorialButton extends UIButton {
    private moveTween !: TWEEN.Tween;
    constructor(
        app: pc.Application,
        position: pc.Vec2,
        assetManager: AssetManager
    ) {
        const buttonTexture = assetManager.getAsset(SafeKeyAsset.IMGHandWhite);
        const fontAsset = assetManager.getAsset(SafeKeyAsset.Font);

        super(
            app,
            position,
            new pc.Vec2(app.graphicsDevice.width/ 8, app.graphicsDevice.width/ 8),
            "",
            fontAsset!,
            buttonTexture,
            new pc.Vec2(25, 0) 
        );

        this.setupClickListener();
        this.setUpMoveTween();

        app.on("update", () => {
            this.moveTween.update();
        });
    }

    private setupClickListener() {
        this.entity.button?.on('click', () => {
            // this.app.fire("UI:OpenPauseGame");
            // GameManager.getInstance().pauseGame();
        });
    }

    private setUpMoveTween() {
        const screenWidth = this.app.graphicsDevice.width;
        const moveDistance = screenWidth * 0.6;
        const positionState = { x: -moveDistance / 2 };
        
        this.moveTween = new TWEEN.Tween(positionState)
            .to({ x: moveDistance / 2 }, 800)
            .easing(TWEEN.Easing.Linear.InOut)
            .onUpdate(() => {
                this.entity.setLocalPosition(positionState.x, this.entity.getLocalPosition().y, this.entity.getLocalPosition().z);
            })
            .yoyo(true)
            .repeat(4)
            .repeatDelay(50)
            .onComplete(() => {
                this.setUpTween();
            })
            .start();
    }

    private setUpTween() {
        const screenWidth = this.app.graphicsDevice.width;
        const moveDistance = screenWidth * 0.4;
        const positionState = { x: -moveDistance / 2 };
        
        this.moveTween = new TWEEN.Tween(positionState)
            .to({ x: moveDistance / 2 }, 800)
            .easing(TWEEN.Easing.Linear.InOut)
            .onUpdate(() => {
                this.entity.setLocalPosition(0, positionState.x, this.entity.getLocalPosition().z);
            })
            .repeat(3)
            .repeatDelay(50)
            .onComplete(() => {
                this.entity.enabled = false;
            })
            .start();
    }
    
}
