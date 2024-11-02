import * as pc from "playcanvas";
import { IUIController } from '../../Interface//IUIController'
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { ResumeButton } from "./ResumeButton";
import { BackHomeButton } from "./BackHomeButton";
import { SoundButton } from "./SoundButton";
import { UIText } from "../Common/UIText";
import { UIPanel } from "../Common/UIPanel";
import { UIManager } from "../../Manager/UIManager";
import { MusicBGButton } from "./MusicBGButton";

export class PauseUI extends pc.Entity implements IUIController {
    private app: pc.Application;
    private assetManager: AssetManager;
    private uiManager: UIManager;
    private screenWidth:number;
    private screenHeight:number;
    private pausePanel: any;

    constructor(app: pc.Application, uiManager: UIManager) {
        super();
        this.app = app;
        this.screenWidth = this.app.graphicsDevice.width;
        this.screenHeight = this.app.graphicsDevice.height;
        this.assetManager = AssetManager.getInstance();
        this.uiManager = uiManager;
        this.setElement();
        this.setupOverlay();
        this.setUpPanel();
        this.setupText();
        this.setupButtons();
    }

    private setElement() {
        this.addComponent('element', {
            anchor: [0.5, 0.5, 0.5, 0.5],
            pivot: [0.5, 0.5],
            width: this.app.graphicsDevice.width,
            height: this.app.graphicsDevice.height,
            type: pc.ELEMENTTYPE_GROUP
        });
    }

    private setupOverlay() {
        const overlay = new pc.Entity("Overlay");
        overlay.addComponent("element", {
            anchor: [0.5, 0.5, 0.5, 0.5],
            pivot: [0.5, 0.5],
            width:  this.screenWidth,
            height: this.screenHeight,
            type: pc.ELEMENTTYPE_IMAGE,
            color: new pc.Color(0, 0, 0),
            opacity: 0.5,
        });

        this.addChild(overlay);
    }

    private setUpPanel(){
        const backgroundTexture = this.assetManager.getAsset(SafeKeyAsset.IMGBackGroundPause);
        this.pausePanel = new UIPanel(new pc.Vec2(this.screenWidth * 0.8, this.screenHeight*0.6), backgroundTexture);

        this.addChild(this.pausePanel.entity);
    }

    private setupText() {
        const pauseText = new UIText(
            this.app,
            this.assetManager,
            "PAUSE",
            new pc.Vec2(0, 0),
            new pc.Vec2(0, 0),
            40,
            new pc.Color(0, 0, 0)
        );
        pauseText.entity.element!.anchor = new pc.Vec4(0.5, 0.65, 0.5, 0.65);
        pauseText.entity.element!.pivot = new pc.Vec2(0.5, 0.5);

        this.addChild(pauseText.entity);
    }

    private setupButtons() {
        const resumeButton = new ResumeButton(this.app, new pc.Vec2(0, 0),
        new pc.Vec2(this.screenWidth *0.4, this.screenHeight*0.09), this.assetManager);
        resumeButton.onClick(() => this.uiManager.openUIInGame());
        resumeButton.entity.element!.anchor = new pc.Vec4(0.5, 0.27, 0.5, 0.27);
        resumeButton.entity.element!.pivot = new pc.Vec2(0.5, 0.5);

        const backHomeButton = new BackHomeButton(this.app, new pc.Vec2(0, 0),
        new pc.Vec2(this.screenWidth *0.4, this.screenHeight*0.09), this.assetManager);
        backHomeButton.entity.element!.anchor = new pc.Vec4(0.5, 0.1, 0.5, 0.1);
        backHomeButton.entity.element!.pivot = new pc.Vec2(0.5, 0.5);

        const musicButton = new MusicBGButton(this.app, new pc.Vec2(0, 0),
        new pc.Vec2(this.screenWidth *0.15, this.screenWidth *0.15), this.assetManager);
        musicButton.entity.element!.anchor = new pc.Vec4(0.35, 0.5, 0.35, 0.5);
        musicButton.entity.element!.pivot = new pc.Vec2(0.5, 0.5);

        const soundButton = new SoundButton(this.app, new pc.Vec2(0, 0),
        new pc.Vec2(this.screenWidth *0.15, this.screenWidth *0.15), this.assetManager);
        soundButton.entity.element!.anchor = new pc.Vec4(0.65, 0.5, 0.65, 0.5);
        soundButton.entity.element!.pivot = new pc.Vec2(0.5, 0.5);

        this.pausePanel.addChild(musicButton.entity);
        this.pausePanel.addChild(soundButton.entity);
        this.pausePanel.addChild(resumeButton.entity);
        this.pausePanel.addChild(backHomeButton.entity);
    }

    Open(): void {
        this.enabled = true;
    }

    Close(): void {
        this.enabled = false;
    }
}
