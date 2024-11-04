import * as pc from "playcanvas";
import { IUIController } from "../../Interface/IUIController";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { UIText } from "../Common/UIText";
import { UIPanel } from "../Common/UIPanel";
import { UIManager } from "../../Manager/UIManager";
import { BackHomeButton } from "./BackHomeButton";
import { GameManager } from "../../Manager/GameManager";

export class RankUI extends pc.Entity implements IUIController {
  private app: pc.Application;
  private assetManager: AssetManager;
  private uiManager: UIManager;
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

  loadPanel(){
    this.setElement();
    this.setUpPanel();
    this.setupText();
    this.setupButtons()
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

  setUpPanel() {
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

    const backgroundRankTexture = this.assetManager.getAsset(
      SafeKeyAsset.IMGRankPanel
    );
    const rankScrollView = new UIPanel(
      new pc.Vec2(this.screenWidth, this.screenHeight * 0.7),
      backgroundRankTexture
    );
    rankScrollView.entity.element!.anchor = new pc.Vec4(0.5, 0.5, 0.5, 0.5);
    rankScrollView.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
    this.addChild(rankScrollView.entity);

    this.addChild(this.createRankScrollView());
  }

  createRankScrollView(): pc.Entity {
    const scrollView = new pc.Entity("RankScrollView");
  
    const viewport = new pc.Entity("Viewport");
    scrollView.addChild(viewport);
    viewport.addComponent("element", {
      anchor: new pc.Vec4(0, 0, 1, 1),
      color: new pc.Color(0.2, 0.2, 0.2),
      mask: true,
      pivot: new pc.Vec2(0.5, 0.5),
      rect: new pc.Vec4(0, 0, 1, 1),
      type: pc.ELEMENTTYPE_IMAGE,
    });
  
    const content = new pc.Entity("Content");
    content.addComponent("layoutgroup", {
      orientation: pc.ORIENTATION_VERTICAL,
      alignment: new pc.Vec2(0, 0),
      spacing: new pc.Vec2(0, 15),
      widthFitting: pc.FITTING_NONE,
      heightFitting: pc.FITTING_WRAP,
      wrap: false,
    });
  
    const topDistancesString  = localStorage.getItem("topDistances");
    const topDistances = topDistancesString ? JSON.parse(topDistancesString) : [];

    for (let i = 0; i < topDistances.length; i++) {
      const rankItem = new pc.Entity(`RankItem-${i}`);
      rankItem.addComponent("element", {
        type: pc.ELEMENTTYPE_IMAGE,
        width: this.screenWidth * 0.9,
        height: this.screenHeight * 0.1,
        pivot: new pc.Vec2(0.5, 0.5),
        anchor: new pc.Vec4(0.5, 1 - (i * 0.1), 0.5, 1 - (i * 0.1)),
      });
      rankItem.element!.texture = this.assetManager.getAsset(SafeKeyAsset.IMGRankItem)?.resource;
      const distanceText = new UIText(
        this.app,
        this.assetManager,
        Math.round(topDistances[i]),
        new pc.Vec2(0, 0),
        new pc.Vec2(0, 0),
        60,
        new pc.Color(0, 0, 0)
      );
      distanceText.entity.element!.anchor = new pc.Vec4(0.65, 0.65, 0.65, 0.65);
      distanceText.entity.element!.pivot = new pc.Vec2(0.5, 0.5);

    rankItem.addChild(distanceText.entity);
      content.addChild(rankItem);
    }
  
    content.addComponent("element", {
      anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new pc.Vec2(0.48, 0.5),
      height:  this.app.graphicsDevice.height * 0.6,
      width: this.app.graphicsDevice.width,
      type: pc.ELEMENTTYPE_GROUP,
      useInput: true,
    });
  
    viewport.addChild(content);
  
    scrollView.addComponent("element", {
      anchor: new pc.Vec4(0.5, 0.43, 0.5, 0.43),
      height: this.app.graphicsDevice.height * 0.5,
      pivot: new pc.Vec2(0.5, 0.5),
      type: pc.ELEMENTTYPE_GROUP,
      useInput: true,
      width: this.screenWidth,
    });
  
    scrollView.addComponent("scrollview", {
      bounceAmount: 0.1,
      contentEntity: content,
      friction: 0.05,
      useMouseWheel: true,
      mouseWheelSensitivity: pc.Vec2.ONE,
      horizontal: false,
      vertical: true,
      viewportEntity: viewport,
      scrollMode: pc.SCROLL_MODE_CLAMP,
    });
  
    return scrollView;
  }
  
  private setupText() {

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

  Open(): void {
    this.enabled = true;
  }

  Close(): void {
    this.enabled = false;
  }
}
