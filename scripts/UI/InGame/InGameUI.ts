import * as pc from "playcanvas";
import { BasePanelUI } from "../Common/BasePanelUI";
import { UIText } from "../Common/UIText";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { SettingButton } from "./SettingButton";
import { UIManager } from "../../Manager/UIManager";
import { GameManager } from "../../Manager/GameManager";

export class InGameUI extends BasePanelUI {
    private scoreText: UIText;
    private distanceText: UIText;
    private timeText: UIText;
    private isMobile: boolean;
    private assetManager: AssetManager;
    

    constructor(app: pc.Application) {
        super(app, 0.65, 0.6, undefined, false);
        this.assetManager = AssetManager.getInstance();
        this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
        
        this.setupText();
        this.setupButtons();
    }

    private setupText() {
        const fontSize = 30;
        const scorePosition = this.isMobile ? new pc.Vec2(0, 0) : new pc.Vec2(0, 30);
        const scoreTexture = this.assetManager.getAsset(SafeKeyAsset.IMGCoinLabel);
        const distanceTexture = this.assetManager.getAsset(SafeKeyAsset.IMGDistanceLabel);
        const timeTexture = this.assetManager.getAsset(SafeKeyAsset.IMGTimeLabel);

        //Score Text
        this.scoreText = new UIText(
            this.app,
            this.assetManager,
            "",
            new pc.Vec2(200, 80),
            scorePosition,
            fontSize,
            new pc.Color(0, 0, 0),
            scoreTexture,
            new pc.Vec2(20, 0),
        );

        this.scoreText.entity.element!.anchor = this.isMobile ? new pc.Vec4(0, 1, 0, 1) : new pc.Vec4(0, 1, 0, 1);
        this.scoreText.entity.element!.pivot = this.isMobile ? new pc.Vec2(0.1, 0) : new pc.Vec2(0.4, -0.4);
        this.scoreText.entity.setLocalPosition(scorePosition.x, scorePosition.y, 0);

        this.panel.addChild(this.scoreText.entity);

        //Distance Text
        this.distanceText = new UIText(
            this.app,
            this.assetManager,
            "",
            new pc.Vec2(200, 80),
            scorePosition,
            fontSize,
            new pc.Color(0, 0, 0),
            distanceTexture,
            new pc.Vec2(20, 0),
        );

        this.distanceText.entity.element!.anchor = this.isMobile ? new pc.Vec4(0, 0.92, 0, 0.92) : new pc.Vec4(0, 0.9, 0, 0.9);
        this.distanceText.entity.element!.pivot = this.isMobile ? new pc.Vec2(0.1, 0) : new pc.Vec2(0.4, -0.4);
        this.distanceText.entity.setLocalPosition(scorePosition.x, scorePosition.y, 0);

        this.panel.addChild(this.distanceText.entity);

        //Time Text
        this.timeText = new UIText(
            this.app,
            this.assetManager,
            "",
            new pc.Vec2(200, 80),
            scorePosition,
            fontSize,
            new pc.Color(0, 0, 0),
            timeTexture,
            new pc.Vec2(20, 0),
        );

        this.timeText.entity.element!.anchor = this.isMobile ? new pc.Vec4(0, 0.84, 0, 0.84) : new pc.Vec4(0, 0.8, 0, 0.8);
        this.timeText.entity.element!.pivot = this.isMobile ? new pc.Vec2(0.1, 0) : new pc.Vec2(0.4, -0.4);
        this.timeText.entity.setLocalPosition(scorePosition.x, scorePosition.y, 0);

        this.panel.addChild(this.timeText.entity);
    }

    private setupButtons() {
        const settingButton = new SettingButton(this.app, new pc.Vec2(0, 0), this.assetManager);
       
        settingButton.entity.element!.anchor = this.isMobile ? [0.9, 1, 0.9, 1] : [1, 1, 1, 1];
        settingButton.entity.element!.pivot = this.isMobile ? [0, 0] : [0, -0.6];

        this.panel.addChild(settingButton.entity);
    }

    public updateScore() {
        const score = GameManager.getInstance().getScore();
        this.scoreText.setText(`${score}`);
    }

    public updateDistance() {
        const distance = GameManager.getInstance().getDistance();
        this.distanceText.setText(`${Math.floor(distance)}`+"m");
    }

    public updateTime() {
        const time = GameManager.getInstance().getTime();
        this.timeText.setText(`${Math.floor(time)}`+"s");
    }
}
