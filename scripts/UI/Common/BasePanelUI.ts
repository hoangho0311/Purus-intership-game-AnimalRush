import * as pc from "playcanvas";
import { UIPanel } from "../Common/UIPanel";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";

export class BasePanelUI extends pc.Entity {
    app: pc.Application;
    panel: UIPanel;
    overlay: pc.Entity;
    screen: pc.Entity;

    private backgroundTexture: pc.Asset | undefined;
    private widthRatio: number;
    private heightRatio: number;

    constructor(app: pc.Application, widthRatio: number, heightRatio: number, backgroundTexture?: pc.Asset, useOverlay: boolean = true) {
        super();
        this.app = app;
        this.widthRatio = widthRatio;
        this.heightRatio = heightRatio;
        this.backgroundTexture = backgroundTexture || undefined;

        this.setupScreen();
        if (useOverlay) {
            this.setupOverlay();
        }
        this.setupPanel();

        this.app.root.addChild(this.screen);
    }

    private setupScreen() {
        this.screen = new pc.Entity("UIScreen");
        this.screen.addComponent("screen", {
            referenceResolution: new pc.Vec2(1280, 720),
            scaleBlend: 0.5,
            scaleMode: pc.SCALEMODE_BLEND,
            screenSpace: true,
        });
    }

    private setupOverlay() {
        const screenWidth = this.app.graphicsDevice.width;
        const screenHeight = this.app.graphicsDevice.height;

        this.overlay = new pc.Entity("Overlay");
        this.overlay.addComponent("element", {
            anchor: [0.5, 0.5, 0.5, 0.5],
            pivot: [0.5, 0.5],
            width: screenWidth*2,
            height: screenHeight*2,
            type: pc.ELEMENTTYPE_IMAGE,
            color: new pc.Color(0, 0, 0),
            opacity: 0.5,
        });

        this.screen.addChild(this.overlay);
    }

    private setupPanel() {
        const screenWidth = this.app.graphicsDevice.width;
        const screenHeight = this.app.graphicsDevice.height;

        const panelWidth = screenWidth * this.widthRatio;
        const panelHeight = screenHeight * this.heightRatio;

        this.panel = new UIPanel(new pc.Vec2(panelWidth, panelHeight), this.backgroundTexture);
        this.panel.entity.setLocalPosition(0, 0, 0);

        this.screen.addChild(this.panel.entity);
        this.enabled = false;
    }

    public show() {
        this.enabled = true;
        this.screen.enabled = true;
    }

    public hide() {
        this.enabled = false;
        this.screen.enabled = false;
    }
}
