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
    private assetManager: AssetManager;
    

    constructor(app: pc.Application) {
        super(app, 0.65, 0.6, undefined, false);
        this.assetManager = AssetManager.getInstance();
        
        this.setupText();
        this.setupButtons();
    }

    private setupText() {
        const fontSize = 30;
        const scorePosition = new pc.Vec2(0, 0);
        const scoreTexture = this.assetManager.getAsset(SafeKeyAsset.IMGCoinLabel);
        const distanceTexture = this.assetManager.getAsset(SafeKeyAsset.IMGDistanceLabel);
        const timeTexture = this.assetManager.getAsset(SafeKeyAsset.IMGTimeLabel);

        //Score Text
        this.scoreText = new UIText(
            this.app,
            this.assetManager,
            "",
            new pc.Vec2(180, 70),
            scorePosition,
            fontSize,
            new pc.Color(0, 0, 0),
            scoreTexture,
            new pc.Vec2(20, 0),
        );

        this.scoreText.entity.element!.anchor = new pc.Vec4(0.03, 0.88, 0.03, 0.88);
        this.scoreText.entity.element!.pivot = new pc.Vec2(0, 0);

        this.screen.addChild(this.scoreText.entity);

        //Distance Text
        this.distanceText = new UIText(
            this.app,
            this.assetManager,
            "",
            new pc.Vec2(180, 70),
            scorePosition,
            fontSize,
            new pc.Color(0, 0, 0),
            distanceTexture,
            new pc.Vec2(20, 0),
        );

        this.distanceText.entity.element!.anchor = new pc.Vec4(0.03, 0.81, 0.03, 0.81);
        this.distanceText.entity.element!.pivot = new pc.Vec2(0, 0);

        this.screen.addChild(this.distanceText.entity);

        //Time Text
        this.timeText = new UIText(
            this.app,
            this.assetManager,
            "",
            new pc.Vec2(180, 70),
            scorePosition,
            fontSize,
            new pc.Color(0, 0, 0),
            timeTexture,
            new pc.Vec2(20, 0),
        );

        this.timeText.entity.element!.anchor = new pc.Vec4(0.03, 0.74, 0.03, 0.74);
        this.timeText.entity.element!.pivot = new pc.Vec2(0, 0);

        this.screen.addChild(this.timeText.entity);
    }

    private setupButtons() {
        const settingButton = new SettingButton(this.app, new pc.Vec2(0, 0), this.assetManager);
       
        settingButton.entity.element!.anchor = [0.8, 0.88, 0.8, 0.88];
        settingButton.entity.element!.pivot = [0, 0];

        this.screen.addChild(settingButton.entity);
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
