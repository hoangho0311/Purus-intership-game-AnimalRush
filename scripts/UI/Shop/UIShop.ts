import * as pc from "playcanvas";
import { IUIController } from "../../Interface/IUIController";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { UIText } from "../Common/UIText";
import { UIPanel } from "../Common/UIPanel";
import { UIManager } from "../../Manager/UIManager";
import { BackHomeButton } from "./BackHomeButton";
import { CoinManager } from "../../Manager/CoinManager";

export class UIShop extends pc.Entity implements IUIController {
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
    this.setUpScrollView();
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

    const scrollView = new UIPanel(
      new pc.Vec2(this.screenWidth, this.screenHeight),
      backgroundTexture
    );
    scrollView.entity.element!.anchor = new pc.Vec4(0.5, 0, 0.5, 0);
    scrollView.entity.element!.pivot = new pc.Vec2(0.5, 0.62);
    this.addChild(scrollView.entity);
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
      this.screenWidth / 3.5,
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

    this.scoreText.entity.element!.anchor = new pc.Vec4(0.7, 0.92, 0.7, 0.92);
    this.scoreText.entity.element!.pivot = new pc.Vec2(0, 0);
    this.scoreText.setText(CoinManager.getInstance().loadTotalCoins());
    this.addChild(this.scoreText.entity);
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
    this.addChild(backHomeButton.entity);
  }

  private setUpScrollView() {
    const content = new pc.Entity("Content");
    content.addComponent("layoutgroup", {
      orientation: pc.ORIENTATION_HORIZONTAL,
      alignment: new pc.Vec2(0, 0),
      spacing: new pc.Vec2(15, 15),
      widthFitting: pc.FITTING_NONE,
      heightFitting: pc.FITTING_WRAP,
      wrap: true,
    });

    const textureKeys = [
      SafeKeyAsset.CharColorTextureAsset,
      SafeKeyAsset.CharColorTexture1Asset,
      SafeKeyAsset.CharColorTexture2Asset,
      SafeKeyAsset.CharColorTexture3Asset,
      SafeKeyAsset.CharColorTexture4Asset,
      SafeKeyAsset.CharColorTexture5Asset,
      SafeKeyAsset.CharColorTexture6Asset,
      SafeKeyAsset.CharColorTexture7Asset,
      SafeKeyAsset.CharColorTexture8Asset,
    ];

    for (let i = 0; i < 8; i++) {
      const box = new pc.Entity(`Box-${i}`);
      box.addComponent("element", {
        type: pc.ELEMENTTYPE_IMAGE,
        color: new pc.Color(0.8, 0.5 + i * 0.05, 0.2 + i * 0.05),
        width: this.app.graphicsDevice.width * 0.2,
        height: this.app.graphicsDevice.width * 0.2,
        pivot: new pc.Vec2(0.5, 0.5),
        useInput: true,
      });
      box.addComponent("button", {
        active: true,
        transitionMode: pc.BUTTON_TRANSITION_MODE_SPRITE_CHANGE,
      });

      const material = new pc.StandardMaterial();
      const textureAsset = this.assetManager.getAsset(textureKeys[i]);
      material.diffuseMap = textureAsset.resource;
      material.update();
      box.element!.on("click", () => {
        this.uiManager.character.applySkinMaterial(material)
      });
      content.addChild(box);
    }

    content.addComponent("element", {
      anchor: new pc.Vec4(0.05, 1, 0.05, 1),
      height: 400,
      pivot: new pc.Vec2(0, 1),
      type: pc.ELEMENTTYPE_GROUP,
      useInput: true,
      width: this.app.graphicsDevice.width,
    });

    const viewport = new pc.Entity("Viewport");
    viewport.addChild(content);
    viewport.addComponent("element", {
      anchor: new pc.Vec4(0, 0, 1, 1),
      color: new pc.Color(0.2, 0.2, 0.2),
      margin: new pc.Vec4(0, 20, 20, 0),
      mask: true,
      opacity: 1,
      pivot: new pc.Vec2(0, 0),
      rect: new pc.Vec4(0, 0, 1, 1),
      type: pc.ELEMENTTYPE_IMAGE,
      useInput: false,
    });

    const scrollview = new pc.Entity("ScrollView");
    scrollview.addChild(viewport);

    this.addChild(scrollview);

    scrollview.addComponent("element", {
      anchor: new pc.Vec4(
        0.5,
        pc.platform.mobile ? 0.25 : 0.4,
        0.5,
        pc.platform.mobile ? 0.25 : 0.4
      ),
      height: 400,
      pivot: new pc.Vec2(0.5, 0.5),
      type: pc.ELEMENTTYPE_GROUP,
      useInput: false,
      width: this.app.graphicsDevice.width,
    });

    scrollview.addComponent("scrollview", {
      bounceAmount: 0.1,
      contentEntity: content,
      friction: 0.05,
      useMouseWheel: true,
      mouseWheelSensitivity: pc.Vec2.ONE,
      horizontal: true,
      horizontalScrollbarVisibility: pc.SCROLLBAR_VISIBILITY_SHOW_WHEN_REQUIRED,
      scrollMode: pc.SCROLL_MODE_BOUNCE,
      vertical: true,
      verticalScrollbarVisibility: pc.SCROLLBAR_VISIBILITY_SHOW_WHEN_REQUIRED,
      viewportEntity: viewport,
    });
  }

  Open(): void {
    this.scoreText.setText(CoinManager.getInstance().loadTotalCoins());
    this.enabled = true;
  }

  Close(): void {
    this.enabled = false;
  }
}
