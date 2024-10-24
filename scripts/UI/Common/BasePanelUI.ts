import * as pc from "playcanvas";
import { UIPanel } from "../Common/UIPanel";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";

export class BasePanelUI extends pc.Entity {
    protected app: pc.Application;
    protected panel: UIPanel;
    protected overlay: pc.Entity;

    private readonly defaultMobileWidthRatio = 0.7;
    private readonly defaultMobileHeightRatio = 0.5;
    private readonly defaultDesktopWidthRatio = 1.4;
    private readonly defaultDesktopHeightRatio = 1.1;

    private backgroundTexture: pc.Asset | undefined;
    private widthRatio: number;
    private heightRatio: number;

    constructor(app: pc.Application, widthRatio?: number, heightRatio?: number, backgroundTexture?: pc.Asset, useOverlay: boolean = true) {
        super();
        this.app = app;
        this.widthRatio = widthRatio || this.defaultMobileWidthRatio;
        this.heightRatio = heightRatio || this.defaultMobileHeightRatio;
        this.backgroundTexture = backgroundTexture || undefined;
        
        this.setupScreen();
        if(useOverlay){
            this.setupOverlay();
        }
        this.setupPanel();
    }

    public setupScreen() {
        this.addComponent('screen', {
            referenceResolution: new pc.Vec2(1280, 720),
            scaleBlend: 0.5,
            scaleMode: pc.SCALEMODE_BLEND,
            screenSpace: true
        });
        this.app.root.addChild(this);
    }

    public setupOverlay() {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        const screenWidth = this.app.graphicsDevice.width * (isMobile ? 1 : 2);
        const screenHeight = this.app.graphicsDevice.height * (isMobile ? 1 : 2);

        this.overlay = new pc.Entity('Overlay');
        this.addChild(this.overlay);

        this.overlay.addComponent('element', {
            anchor: [0.5, 0.5, 0.5, 0.5],
            pivot: [0.5, 0.5],
            width: screenWidth,
            height: screenHeight,
            type: pc.ELEMENTTYPE_IMAGE,
            color: new pc.Color(0, 0, 0),
            opacity: 0.5,
        });

        this.overlay.setLocalPosition(0, 0, 0);
    }

    public setupPanel() {
        const screenWidth = this.app.graphicsDevice.width;
        const screenHeight = this.app.graphicsDevice.height;
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        const panelWidth = screenWidth * (isMobile ? this.widthRatio : this.defaultDesktopWidthRatio);
        const panelHeight = screenHeight * (isMobile ? this.heightRatio : this.defaultDesktopHeightRatio);

        this.panel = new UIPanel(new pc.Vec2(panelWidth, panelHeight), this.backgroundTexture);
        this.panel.entity.setLocalPosition(0, 0, 0);
        this.addChild(this.panel.entity);
        this.enabled = false;
    }

    public show() {
        this.enabled = true;
    }

    public hide() {
        this.enabled = false;
    }
}
