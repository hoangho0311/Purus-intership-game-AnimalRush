import * as pc from "playcanvas";
import { UIButton } from "../Common/UIButton";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";

export class OpenShopButton extends UIButton {
    constructor(
        app: pc.Application,
        position: pc.Vec2,
        sizeButton: pc.Vec2,
        assetManager: AssetManager
    ) {
        const buttonTexture = assetManager.getAsset(SafeKeyAsset.IMGShopButton);
        const fontAsset = assetManager.getAsset(SafeKeyAsset.Font);

        super(
            app,
            position,
            sizeButton,
            "SHOP",
            fontAsset!,
            buttonTexture,
            new pc.Vec2(20, 0) 
        );

        this.setupClickListener();
    }

    private setupClickListener() {
        this.entity.button?.on('click', () => {
            this.app.fire("UI:OpenShop");
        });
    }
}
