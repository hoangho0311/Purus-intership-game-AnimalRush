import * as pc from "playcanvas";
import { UIButton } from "../Common/UIButton";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { UIManager } from "../../Manager/UIManager";

export class BackToHomeButton extends UIButton {
    constructor(
        app: pc.Application,
        position: pc.Vec2,
        assetManager: AssetManager
    ) {
        const buttonTexture = assetManager.getAsset(SafeKeyAsset.IMGBlueButton);
        const fontAsset = assetManager.getAsset(SafeKeyAsset.Font);

        super(
            app,
            position,
            new pc.Vec2(240, 100),
            "HOME",
            fontAsset!,
            buttonTexture,
            new pc.Vec2(0, 0)
        );

        this.setupClickListener();
    }

    private setupClickListener() {
        this.entity.button?.on('click', () => {
           // UIManager.getInstance(this.app).showInGameUI();
            console.log("Back Home");
        });
    }
}
