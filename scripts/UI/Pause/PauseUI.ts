import * as pc from "playcanvas";
import { BasePanelUI } from "../Common/BasePanelUI";
import { UIText } from "../Common/UIText";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { ResumeButton } from "./ResumeButton";
import { BackHomeButton } from "./BackHomeButton";

export class PauseUI extends BasePanelUI {
    private isMobile: boolean;
    private assetManager: AssetManager;

    constructor(app: pc.Application) {
        const assetManager = AssetManager.getInstance();
        const backgroundTexture = assetManager.getAsset(SafeKeyAsset.IMGBackGroundPause);
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        
        super(app, isMobile ? 0.65 : 0.8, isMobile ? 0.5 : 0.6, backgroundTexture, true);
        
        this.assetManager = assetManager;
        this.isMobile = isMobile;

        this.setupText();
        this.setupButtons();
    }

    private setupText() {
        const screenHeight = this.app.graphicsDevice.height;
        const textPositionY = screenHeight * (this.isMobile ? 0.13 : 0.26);

        //Title
        const pauseText = new UIText(
            this.app,
            this.assetManager,
            "PAUSE",
            new pc.Vec2(0, textPositionY),
            new pc.Vec2(0, textPositionY),
            this.isMobile ? 60 : 70,
            new pc.Color(0, 0, 0)
        );

        this.panel.addChild(pauseText.entity);
    }

    private setupButtons() {
        const resumeButton = new ResumeButton(this.app, new pc.Vec2(0, 50), this.assetManager);
        resumeButton.onClick(() => this.hide());

        const backHomeButton = new BackHomeButton(this.app, new pc.Vec2(0, -50), this.assetManager);

        this.panel.addChild(resumeButton.entity);
        this.panel.addChild(backHomeButton.entity);
    }
}
