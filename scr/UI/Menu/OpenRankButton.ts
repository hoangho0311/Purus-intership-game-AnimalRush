import * as pc from "playcanvas";
import { UIButton } from "../Common/UIButton";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";

export class OpenRankButton extends UIButton {
    constructor(
        app: pc.Application,
        position: pc.Vec2,
        sizeButton: pc.Vec2,
        assetManager: AssetManager
    ) {
        const buttonTexture = assetManager.getAsset(SafeKeyAsset.IMGRankButton);
        const fontAsset = assetManager.getAsset(SafeKeyAsset.Font);

        super(
            app,
            position,
            sizeButton,
            "RANK",
            fontAsset!,
            buttonTexture,
            new pc.Vec2(40, 0) 
        );

        this.setupClickListener();
    }

    private setupClickListener() {
        this.entity.button?.on('click', () => {
            this.app.fire("UI:OpenRank");
        });
    }
}
