import * as pc from "playcanvas";
import { UIButton } from "../Common/UIButton";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { SoundManager } from "../../Manager/SoundManager";

export class MusicBGButton extends UIButton {
    private buttonTextureOn: pc.Asset;
    private buttonTextureOff: pc.Asset;
    private soundManager: SoundManager;

    constructor(
        app: pc.Application,
        position: pc.Vec2,
        sizeButton: pc.Vec2,
        assetManager: AssetManager
    ) {
        const buttonTextureOn = assetManager.getAsset(SafeKeyAsset.IMGButtonSoundOn)!;
        const buttonTextureOff = assetManager.getAsset(SafeKeyAsset.IMGButtonSoundOff)!;

        const fontAsset = assetManager.getAsset(SafeKeyAsset.Font);

        super(
            app,
            position,
            sizeButton,
            "",
            fontAsset!,
            buttonTextureOn,
            new pc.Vec2(0, 0)
        );

        this.buttonTextureOn = buttonTextureOn;
        this.buttonTextureOff = buttonTextureOff;
        this.soundManager = SoundManager.getInstance();

        this.setupClickListener();
    }

    private setupClickListener() {
        this.entity.button?.on("click", () => {
            this.soundManager.toggleMusic();
            this.changeIcon();
        });
    }

    private changeIcon() {
        const isMuted = this.soundManager.isMusicMuted;
        const newTexture = isMuted ? this.buttonTextureOff.resource : this.buttonTextureOn.resource;
        
        this.entity.element!.texture = newTexture;
    }
}
