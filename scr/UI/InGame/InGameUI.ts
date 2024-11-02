import * as pc from "playcanvas";
import { UIText } from "../Common/UIText";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { SettingButton } from "./SettingButton";
import { UIManager } from "../../Manager/UIManager";
import { GameManager } from "../../Manager/GameManager";
import { IUIController } from "../../Interface//IUIController";
import { TutorialButton } from "./TutorialButton";
import { UIPanel } from "../Common/UIPanel";

export class InGameUI extends pc.Entity implements IUIController {
  private app: pc.Application;
  private assetManager: AssetManager;
  private uiManager: UIManager;
  private scoreText: UIText;
  private distanceText: UIText;
  private timeText: UIText;
  private screenWidth: number;
  private screenHeight: number;

  constructor(app: pc.Application, uiManager: UIManager) {
    super();
    this.app = app;
    this.screenWidth = this.app.graphicsDevice.width;
    this.screenHeight = this.app.graphicsDevice.height;
    this.assetManager = AssetManager.getInstance();
    this.uiManager = uiManager;
    this.setElement();
    this.setupText();
    this.setupButtons();
    this.setupTutorial();
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

  private setupTutorial() {
    const tutorialButton = new TutorialButton(
      this.app,
      new pc.Vec2(0, 0),
      this.assetManager
    );
    tutorialButton.entity.element!.anchor = new pc.Vec4(0.5, 0.4, 0.5, 0.4);
    tutorialButton.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
    this.addChild(tutorialButton.entity);
  }

  private setupText() {
    const fontSize = this.screenWidth / 19;
    const scorePosition = new pc.Vec2(0, 0);
    const scoreTexture = this.assetManager.getAsset(SafeKeyAsset.IMGCoinLabel);
    const distanceTexture = this.assetManager.getAsset(
      SafeKeyAsset.IMGDistanceLabel
    );
    const timeTexture = this.assetManager.getAsset(SafeKeyAsset.IMGTimeLabel);
    const lableSize = new pc.Vec2(this.screenWidth / 3, this.screenHeight / 17);
    const textColor = new pc.Color(0, 0, 0);
    const textPosition = new pc.Vec2(15, 0);
    //Score Text
    this.scoreText = new UIText(
      this.app,
      this.assetManager,
      "",
      lableSize,
      scorePosition,
      fontSize,
      textColor,
      scoreTexture,
      textPosition
    );

    this.scoreText.entity.element!.anchor = new pc.Vec4(0.03, 0.92, 0.03, 0.92);
    this.scoreText.entity.element!.pivot = new pc.Vec2(0, 0);

    this.addChild(this.scoreText.entity);

    //Distance Text
    this.distanceText = new UIText(
      this.app,
      this.assetManager,
      "",
      lableSize,
      scorePosition,
      fontSize,
      textColor,
      distanceTexture,
      textPosition
    );

    this.distanceText.entity.element!.anchor = new pc.Vec4(
      0.03,
      0.86,
      0.03,
      0.86
    );
    this.distanceText.entity.element!.pivot = new pc.Vec2(0, 0);

    this.addChild(this.distanceText.entity);

    //Time Text
    this.timeText = new UIText(
      this.app,
      this.assetManager,
      "",
      lableSize,
      scorePosition,
      fontSize,
      textColor,
      timeTexture,
      textPosition
    );

    this.timeText.entity.element!.anchor = new pc.Vec4(0.03, 0.8, 0.03, 0.8);
    this.timeText.entity.element!.pivot = new pc.Vec2(0, 0);

    this.addChild(this.timeText.entity);
  }

  private setupButtons() {
    const settingButton = new SettingButton(
      this.app,
      new pc.Vec2(0, 0),
      this.assetManager
    );

    settingButton.entity.element!.anchor = [0.9, 0.95, 0.9, 0.95];
    settingButton.entity.element!.pivot = [0.5, 0.5];

    this.addChild(settingButton.entity);
  }

  public updateScore() {
    const score = GameManager.getInstance().getCoin();
    this.scoreText.setText(`${score}`);
  }

  public updateDistance() {
    const distance = GameManager.getInstance().getDistance();
    this.distanceText.setText(`${Math.floor(distance)}` + "m");
  }

  public updateTime() {
    const timeInSeconds = Math.floor(GameManager.getInstance().getTime());
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    const formattedTime = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
    this.timeText.setText(formattedTime);
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  private onUpdate = () => {
    this.updateScore();
    this.updateDistance();
    this.updateTime();
  };

  Open(): void {
    this.enabled = true;
    this.app.on("update", this.onUpdate);
  }

  Close(): void {
    this.enabled = false;
    this.app.off("update", this.onUpdate);
  }
}
