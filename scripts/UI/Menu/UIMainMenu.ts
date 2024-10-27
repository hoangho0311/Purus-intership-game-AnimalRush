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
      SafeKeyAsset.IMGBackGroundPaper
    );
    const pausePanel = new UIPanel(
      new pc.Vec2(this.screenWidth, this.screenHeight * 0.2),
      undefined
    );
    pausePanel.entity.element!.anchor = new pc.Vec4(0.5, 1, 0.5, 1);
    pausePanel.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
    this.addChild(pausePanel.entity);
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
      this.screenWidth / 2.7,
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

    this.scoreText.entity.element!.anchor = new pc.Vec4(0.6, 0.92, 0.6, 0.92);
    this.scoreText.entity.element!.pivot = new pc.Vec2(0, 0);

    this.addChild(this.scoreText.entity);

    this.scoreText.setText(CoinManager.getInstance().getTotalCoins());
  }

  private setupButtons() {
    const startGameButton = new StartGameButton(
      this.app,
      new pc.Vec2(0, -100),
      new pc.Vec2(this.screenWidth * 0.9, this.screenHeight * 0.11),
      this.assetManager
    );

    this.addChild(startGameButton.entity);

    const openShopButton = new OpenShopButton(
      this.app,
      new pc.Vec2(0, 0),
      new pc.Vec2(this.screenWidth * 0.3, this.screenWidth * 0.12),
      this.assetManager
    );

    openShopButton.entity.element!.anchor = new pc.Vec4(0.03, 0.6, 0.03, 0.6);
    openShopButton.entity.element!.pivot = new pc.Vec2(0, 0);

    this.addChild(openShopButton.entity);

    let scaleUp = true;
    const maxScale = 1.2;
    const minScale = 1.0;
    const scaleSpeed = 0.5;

    this.app.on("update", (dt) => {
      const currentScale = startGameButton.entity.getLocalScale();

      if (scaleUp) {
        startGameButton.entity.setLocalScale(
          Math.min(currentScale.x + dt * scaleSpeed, maxScale),
          Math.min(currentScale.y + dt * scaleSpeed, maxScale),
          1
        );

        if (currentScale.x >= maxScale) {
          scaleUp = false;
        }
      } else {
        startGameButton.entity.setLocalScale(
          Math.max(currentScale.x - dt * scaleSpeed, minScale),
          Math.max(currentScale.y - dt * scaleSpeed, minScale),
          1
        );

        if (currentScale.x <= minScale) {
          scaleUp = true;
        }
      }
    });
  }

  Open(): void {
    this.enabled = true;
  }

  Close(): void {
    this.enabled = false;
  }
}
