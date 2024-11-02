import * as pc from "playcanvas";
import { IUIController } from "../../Interface/IUIController";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { UIText } from "../Common/UIText";
import { UIPanel } from "../Common/UIPanel";
import { UIManager } from "../../Manager/UIManager";
import { MusicBGButton } from "./MusicBGButton";
import { SoundButton } from "./SoundButton";
import { BackHomeButton } from "./BackHomeButton";

export class SettingUI extends pc.Entity implements IUIController {
  private app: pc.Application;
  private assetManager: AssetManager;
  private uiManager: UIManager;
  private screenWidth: number;
  private screenHeight: number;
  private pausePanel: any;

  constructor(app: pc.Application, uiManager: UIManager) {
    super();
    this.app = app;
    this.screenWidth = this.app.graphicsDevice.width;
    this.screenHeight = this.app.graphicsDevice.height;
    this.assetManager = AssetManager.getInstance();
    this.uiManager = uiManager;
    this.setElement();
    this.setUpPanel();
    this.setupText();
    this.setupButtons();
  }

  private setElement() {
    this.addComponent("element", {
      anchor: [0.5, 0.5, 0.5, 0.5],
      pivot: [0.5, 0.5],
      width: this.app.graphicsDevice.width,
      height: this.app.graphicsDevice.height,
      type: pc.ELEMENTTYPE_GROUP,
    });
  }

  private setUpPanel() {
    const backgroundBarTopTexture = this.assetManager.getAsset(
      SafeKeyAsset.IMGBarTop
    );
    const barTopPanel = new UIPanel(
      new pc.Vec2(this.screenWidth, this.screenHeight * 0.2),
      backgroundBarTopTexture
    );
    barTopPanel.entity.element!.anchor = new pc.Vec4(0.5, 1, 0.5, 1);
    barTopPanel.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
    this.addChild(barTopPanel.entity);

    const backgroundTexture = this.assetManager.getAsset(
      SafeKeyAsset.IMGBackGroundSetting
    );
    this.pausePanel = new UIPanel(
      new pc.Vec2(this.screenWidth * 0.7, this.screenHeight * 0.2),
      backgroundTexture
    );

    this.addChild(this.pausePanel.entity);
  }

  private setupText() {
    const titleText = new UIText(
      this.app,
      this.assetManager,
      "SETIING",
      new pc.Vec2(0, 0),
      new pc.Vec2(0, 0),
      20,
      new pc.Color(0, 0, 0)
  );
  titleText.entity.element!.anchor = new pc.Vec4(0.5, 0.565, 0.5, 0.565);
  titleText.entity.element!.pivot = new pc.Vec2(0.5, 0.5);

  this.addChild(titleText.entity);
  }

  private setupButtons() {
    const backHomeButton = new BackHomeButton(
      this.app,
      new pc.Vec2(0, 0),
      new pc.Vec2(this.screenHeight * 0.065, this.screenHeight * 0.065),
      this.assetManager
    );
    backHomeButton.entity.element!.anchor = new pc.Vec4(0.03, 0.92, 0.03, 0.92);
    backHomeButton.entity.element!.pivot = new pc.Vec2(0, 0);

    const musicButton = new MusicBGButton(
      this.app,
      new pc.Vec2(0, 0),
      new pc.Vec2(this.screenWidth * 0.15, this.screenWidth * 0.15),
      this.assetManager
    );
    musicButton.entity.element!.anchor = new pc.Vec4(0.3, 0.35, 0.3, 0.35);
    musicButton.entity.element!.pivot = new pc.Vec2(0.5, 0.5);

    const soundButton = new SoundButton(
      this.app,
      new pc.Vec2(0, 0),
      new pc.Vec2(this.screenWidth * 0.15, this.screenWidth * 0.15),
      this.assetManager
    );
    soundButton.entity.element!.anchor = new pc.Vec4(0.65, 0.35, 0.65, 0.35);
    soundButton.entity.element!.pivot = new pc.Vec2(0.5, 0.5);

    this.pausePanel.addChild(musicButton.entity);
    this.pausePanel.addChild(soundButton.entity);
    this.addChild(backHomeButton.entity);
  }

  Open(): void {
    this.enabled = true;
  }

  Close(): void {
    this.enabled = false;
  }
}
