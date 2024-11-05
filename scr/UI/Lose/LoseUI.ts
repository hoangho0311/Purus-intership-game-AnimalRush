import * as pc from "playcanvas";
import { UIText } from "../Common/UIText";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { GameManager } from "../../Manager/GameManager";
import { ReplayButton } from "./ReplayButton";
import { BackToHomeButton } from "./BackToHomeButton";
import { IUIController } from '../../Interface//IUIController'
import { UIManager } from "../../Manager/UIManager";
import { UIPanel } from "../Common/UIPanel";

export class LoseUI extends pc.Entity implements IUIController {
    private app: pc.Application;
    private assetManager: AssetManager;
    private uiManager: UIManager;
    private screenWidth:number;
    private screenHeight:number;
    private scoreText: UIText;
    private distanceText: UIText;
    private timeText: UIText;
    private highScoreText: UIText;

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
        this.showHighScoreText();

        this.app.on("UI:OpenLoseGame", this.updateLoseUI, this);
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
        const backgroundTexture = this.assetManager.getAsset(SafeKeyAsset.IMGBackGroundLose);
        const pausePanel = new UIPanel(new pc.Vec2(this.screenWidth * 0.8, this.screenHeight*0.6), backgroundTexture);

        this.addChild(pausePanel.entity);
    }

    private setupText() {
        


        //Lose Title
        const loseTitle = new UIText(
            this.app,
            this.assetManager,
            "YOU LOST",
            new pc.Vec2(0, 0),
            new pc.Vec2(0, 0),
            this.app.graphicsDevice.width/15,
            new pc.Color(1, 1, 1)
        );
        loseTitle.entity.element!.anchor =  new pc.Vec4(0.5, 0.55, 0.5, 0.55);
        loseTitle.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
        this.addChild(loseTitle.entity);

        //Distance Text
        this.distanceText = new UIText(
            this.app,
            this.assetManager,
            "100m",
            new pc.Vec2(0, 0),
            new pc.Vec2(0, 0),
            this.app.graphicsDevice.width/15,
            new pc.Color(0, 0, 0)
        );
        this.distanceText.entity.element!.anchor =  new pc.Vec4(0.5, 0.48, 0.5, 0.48);
        this.distanceText.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
        this.addChild(this.distanceText.entity);     
        
        //Coin Text
        this.scoreText = new UIText(
            this.app,
            this.assetManager,
            "100",
            new pc.Vec2(0, 0),
            new pc.Vec2(0, 0),
            this.app.graphicsDevice.width/15,
            new pc.Color(0, 0, 0)
        );
        this.scoreText.entity.element!.anchor =  new pc.Vec4(0.5, 0.42, 0.5, 0.42);
        this.scoreText.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
        this.addChild(this.scoreText.entity);     

        //Time Text
        this.timeText = new UIText(
            this.app,
            this.assetManager,
            "10s",
            new pc.Vec2(0, 0),
            new pc.Vec2(0, 0),
            this.app.graphicsDevice.width/15,
            new pc.Color(0, 0, 0)
        );
        this.timeText.entity.element!.anchor =  new pc.Vec4(0.5, 0.36, 0.5, 0.36);
        this.timeText.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
        this.addChild(this.timeText.entity);     
    }

    private setupButtons() {

        //Replay Button
        const replayButton = new ReplayButton(this.app, new pc.Vec2(0, 0), this.assetManager);
       
        replayButton.entity.element!.anchor = new pc.Vec4(0.3, 0.27, 0.3, 0.27);
        replayButton.entity.element!.pivot = new pc.Vec2(0.5, 0.5);

        this.addChild(replayButton.entity);

        //Back To Home Button
        const backToHomeButton = new BackToHomeButton(this.app, new pc.Vec2(0, 0), this.assetManager);
       
        backToHomeButton.entity.element!.anchor =  new pc.Vec4(0.7, 0.27, 0.7, 0.27);
        backToHomeButton.entity.element!.pivot = new pc.Vec2(0.5, 0.5);

        this.addChild(backToHomeButton.entity);
    }

    showHighScoreText(){
        this.highScoreText = new UIText(
            this.app,
            this.assetManager,
            "NEW SCORE",
            new pc.Vec2(0, 0),
            new pc.Vec2(0, 0),
            this.app.graphicsDevice.width/15,
            new pc.Color(0, 0, 0)
        );
        this.highScoreText.entity.element!.anchor =  new pc.Vec4(0.4, 0.7, 0.4, 0.7);
        this.highScoreText.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
        this.highScoreText.entity.setLocalEulerAngles(0, 0, 45);
        this.highScoreText.entity.enabled = false;
        this.addChild(this.highScoreText.entity);
    }

    private updateLoseUI(): void {
        this.updateScoreText();
        this.updateDistanceText();
        this.updateTimeText();
        if(GameManager.getInstance().showNewHighScoreText())
        {
            this.highScoreText.entity.enabled = true;
        }else{
            this.highScoreText.entity.enabled = false;
        }
    }

    public updateScoreText() {
        const score = GameManager.getInstance().getCoin();
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

    Open(): void {
        this.enabled = true;
    }

    Close(): void {
        this.enabled = false;
    }
}
