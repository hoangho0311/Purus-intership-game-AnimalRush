import * as pc from "playcanvas";
import { UIButton } from "../Common/UIButton";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { UIManager } from "../../Manager/UIManager";
import { GameManager } from "../../Manager/GameManager";

export class SettingButton extends UIButton {
    constructor(
        app: pc.Application,
        position: pc.Vec2,
        assetManager: AssetManager
    ) {
        const buttonTexture = assetManager.getAsset(SafeKeyAsset.IMGButtonSetting);
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
    }

    private setupClickListener() {
        this.entity.button?.on('click', () => {
            this.app.fire("UI:OpenSettingMenu");
            // GameManager.getInstance().pauseGame();
        });
    }
}
