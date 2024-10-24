import * as pc from "playcanvas";
import { BasePanelUI } from "../Common/BasePanelUI";
import { UIText } from "../Common/UIText";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { GameManager } from "../../Manager/GameManager";
import { ReplayButton } from "./ReplayButton";
import { BackToHomeButton } from "./BackToHomeButton";

export class LoseUI extends BasePanelUI {
    private isMobile: boolean;
    private assetManager: AssetManager;
    private scoreText: UIText;
    private distanceText: UIText;
    private timeText: UIText;

    constructor(app: pc.Application) {
        const assetManager = AssetManager.getInstance();
        const backgroundTexture = assetManager.getAsset(SafeKeyAsset.IMGBackGroundLose);
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        super(app, 0.65, 0.55, backgroundTexture, true);

        this.assetManager = assetManager;
        this.isMobile = isMobile;

        this.setupText();
        this.setupButtons();
    }

    private setupText() {
        const screenHeight = this.app.graphicsDevice.height;
        const textPositionY = screenHeight * (this.isMobile ? 0.046 : 0.1);

        //Lose Title
        const loseTitle = new UIText(
            this.app,
            this.assetManager,
            "YOU LOST",
            new pc.Vec2(0, textPositionY),
            new pc.Vec2(0, textPositionY),
            this.isMobile ? 50 : 50,
            new pc.Color(1, 1, 1)
        );
        this.panel.addChild(loseTitle.entity);

        //Distance Text
        this.distanceText = new UIText(
            this.app,
            this.assetManager,
            "100m",
            new pc.Vec2(0, textPositionY),
            new pc.Vec2(10, textPositionY - 120),
            this.isMobile ? 50 : 50,
            new pc.Color(0, 0, 0)
        );
        this.panel.addChild(this.distanceText.entity);     
        
        //Coin Text
        this.scoreText = new UIText(
            this.app,
            this.assetManager,
            "100",
            new pc.Vec2(0, textPositionY),
            new pc.Vec2(10, textPositionY - 210),
            this.isMobile ? 50 : 50,
            new pc.Color(0, 0, 0)
        );
        this.panel.addChild(this.scoreText.entity);     

        //Time Text
        this.timeText = new UIText(
            this.app,
            this.assetManager,
            "10s",
            new pc.Vec2(0, textPositionY),
            new pc.Vec2(10, textPositionY - 300),
            this.isMobile ? 50 : 50,
            new pc.Color(0, 0, 0)
        );
        this.panel.addChild(this.timeText.entity);     
    }

    private setupButtons() {

        //Replay Button
        const replayButton = new ReplayButton(this.app, new pc.Vec2(0, 0), this.assetManager);
       
        replayButton.entity.element!.anchor = this.isMobile ? [0.1, 0.1, 0.1, 0.1] : [0.1, 0, 0.1, 0];
        replayButton.entity.element!.pivot = this.isMobile ? [0, 0] : [0, -0.6];

        this.panel.addChild(replayButton.entity);

        //Back To Home Button
        const backToHomeButton = new BackToHomeButton(this.app, new pc.Vec2(0, 0), this.assetManager);
       
        backToHomeButton.entity.element!.anchor = this.isMobile ? [0.55, 0.1, 0.55, 0.1] : [0.55, 0, 0.55, 0];
        backToHomeButton.entity.element!.pivot = this.isMobile ? [0, 0] : [0, -0.6];

        this.panel.addChild(backToHomeButton.entity);
    }

    public updateScoreText() {
        const score = GameManager.getInstance().getScore();
        this.scoreText.setText(`${score}`);
    }

    public updateDistanceText() {
        const distance = GameManager.getInstance().getDistance();
        this.distanceText.setText(`${Math.floor(distance)}`+"m");
    }

    public updateTimeText() {
        const time = GameManager.getInstance().getTime();
        this.timeText.setText(`${Math.floor(time)}`+"s");
    }
}
