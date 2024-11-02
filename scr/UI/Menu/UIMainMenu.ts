import * as pc from "playcanvas";
import { IUIController } from "../../Interface/IUIController";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { UIText } from "../Common/UIText";
import { UIPanel } from "../Common/UIPanel";
import { UIManager } from "../../Manager/UIManager";
import { StartGameButton } from "./StartGameButton";
import { OpenShopButton } from "./OpenShopButton";
import { CoinManager } from "../../Manager/CoinManager";
import { OpenRankButton } from "./OpenRankButton";
import { SettingButton } from "./SettingButton";
import { PanelStartGame } from "./PanelStartGame";

export class UIMainMenu extends pc.Entity implements IUIController {
  private app: pc.Application;
  private assetManager: AssetManager;
  private uiManager: UIManager;
  private scoreText: UIText;
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
    const backgroundTexture = this.assetManager.getAsset(
      SafeKeyAsset.IMGBarTop
    );
    const barTopPanel = new UIPanel(
      new pc.Vec2(this.screenWidth, this.screenHeight * 0.2),
      backgroundTexture
    );
    barTopPanel.entity.element!.anchor = new pc.Vec4(0.5, 1, 0.5, 1);
    barTopPanel.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
    this.addChild(barTopPanel.entity);
  }

  private setupText() {
    const fontSize = this.screenWidth / 19;
    const scorePosition = new pc.Vec2(0, 0);
    const scoreTexture = this.assetManager.getAsset(SafeKeyAsset.IMGCoinLabel);
    const distanceTexture = this.assetManager.getAsset(
      SafeKeyAsset.IMGDistanceLabel
    );
    const timeTexture = this.assetManager.getAsset(SafeKeyAsset.IMGTimeLabel);
    const lableSize = new pc.Vec2(
      this.screenWidth / 3,
      this.screenHeight / 16
    );
    const textColor = new pc.Color(0, 0, 0);
    const textPosition = new pc.Vec2(10, 0);

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

    this.scoreText.entity.element!.anchor = new pc.Vec4(0.5, 0.92, 0.5, 0.92);
    this.scoreText.entity.element!.pivot = new pc.Vec2(0, 0);

    this.addChild(this.scoreText.entity);

    this.scoreText.setText(CoinManager.getInstance().loadTotalCoins());
  }

  private setupButtons() {
    const panelStartGame = new PanelStartGame(
      this.app,
      new pc.Vec2(0, 0),
      new pc.Vec2(this.screenWidth, this.screenHeight*0.6),
      this.assetManager
    );
    panelStartGame.entity.element!.anchor = new pc.Vec4(0, 0, 1, 0.6); 
    panelStartGame.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
    this.addChild(panelStartGame.entity);


    const startGameButton = new StartGameButton(
      this.app,
      new pc.Vec2(0, 0),
      new pc.Vec2(this.screenWidth * 0.9, this.screenHeight * 0.11),
      this.assetManager
    );
    startGameButton.entity.element!.anchor = new pc.Vec4(0.5, 0.5, 0.5, 0.5); 
    startGameButton.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
    panelStartGame.entity.addChild(startGameButton.entity);

    const openShopButton = new OpenRankButton(
      this.app,
      new pc.Vec2(0, 0),
      new pc.Vec2(this.screenWidth * 0.3, this.screenWidth * 0.12),
      this.assetManager
    );
    openShopButton.entity.element!.anchor = new pc.Vec4(0.03, 0.6, 0.03, 0.6);
    openShopButton.entity.element!.pivot = new pc.Vec2(0, 0);
    this.addChild(openShopButton.entity);

    const openRankButton = new OpenShopButton(
      this.app,
      new pc.Vec2(0, 0),
      new pc.Vec2(this.screenWidth * 0.3, this.screenWidth * 0.12),
      this.assetManager
    );
    openRankButton.entity.element!.anchor = new pc.Vec4(0.03, 0.7, 0.03, 0.7);
    openRankButton.entity.element!.pivot = new pc.Vec2(0, 0);
    this.addChild(openRankButton.entity);

    const settingButton = new SettingButton(
      this.app,
      new pc.Vec2(0, 0),
      this.assetManager
    );
    settingButton.entity.element!.anchor = new pc.Vec4(0.9, 0.95, 0.9, 0.95);
    settingButton.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
    this.addChild(settingButton.entity);
  }

  Open(): void {
    this.scoreText.setText(CoinManager.getInstance().loadTotalCoins());
    this.enabled = true;
  }

  Close(): void {
    this.enabled = false;
  }
}
