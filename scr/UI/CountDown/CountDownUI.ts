import * as pc from "playcanvas";
import { UIText } from "../Common/UIText";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { UIManager } from "../../Manager/UIManager";
import { GameManager } from "../../Manager/GameManager";
import { IUIController } from "../../Interface//IUIController";

export class CountDownUI extends pc.Entity implements IUIController {
  private app: pc.Application;
  private assetManager: AssetManager;
  private uiManager: UIManager;
  private timeText: UIText;
  private screenWidth: number;
  private screenHeight: number;
  private countdownValue: number;
  private countdownInterval: any;

  constructor(app: pc.Application, uiManager: UIManager) {
    super();
    this.app = app;
    this.screenWidth = this.app.graphicsDevice.width;
    this.screenHeight = this.app.graphicsDevice.height;
    this.assetManager = AssetManager.getInstance();
    this.uiManager = uiManager;
    this.countdownValue = 3;

    this.setElement();
    this.setupText();
  }

  private setElement() {
    this.addComponent("element", {
      anchor: [0.5, 0.5, 0.5, 0.5],
      pivot: [0.5, 0.5],
      width: this.screenWidth,
      height: this.screenHeight,
      type: pc.ELEMENTTYPE_GROUP,
    });
  }

  private setupText() {
    const fontSize = this.screenWidth / 19;
    const scorePosition = new pc.Vec2(0, 0);
    const timeTexture = this.assetManager.getAsset(SafeKeyAsset.IMGTimeLabel);
    const lableSize = new pc.Vec2(this.screenWidth / 3, this.screenHeight / 17);
    const textColor = new pc.Color(0, 0, 0);
    const textPosition = new pc.Vec2(15, 0);

    //Time Text
    this.timeText = new UIText(
      this.app,
      this.assetManager,
      "3",
      lableSize,
      scorePosition,
      fontSize,
      textColor,
      timeTexture,
      textPosition
    );

    this.timeText.entity.element!.anchor = new pc.Vec4(0.5, 0.5, 0.5, 0.5);
    this.timeText.entity.element!.pivot = new pc.Vec2(0.5, 0.5);

    this.addChild(this.timeText.entity);
  }

  public startCountdown() {
    this.countdownValue = 3;
    this.timeText.setText(this.countdownValue.toString());

    this.countdownInterval = setInterval(() => {
      this.countdownValue--;
      if (this.countdownValue > 0) {
        this.timeText.setText(this.countdownValue.toString());
      } else {
        clearInterval(this.countdownInterval);
        this.app.fire("UI:OpenInGame");
        GameManager.getInstance().resumeGame();
      }
    }, 1000);
  }

  Open(): void {
    this.enabled = true;
  }

  Close(): void {
    this.enabled = false;
  }
}
