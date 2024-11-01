import * as pc from "playcanvas";
import { IUIController } from "../../Interface/IUIController";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { UIText } from "../Common/UIText";
import { UIPanel } from "../Common/UIPanel";
import { UIManager } from "../../Manager/UIManager";
import { BackHomeButton } from "./BackHomeButton";

export class UIRank extends pc.Entity implements IUIController {
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

    this.addRankItems(rankScrollView.entity);
  }

  private addRankItems(parentEntity: pc.Entity) {
    const rankItems = [
      SafeKeyAsset.IMGRankItem,
      SafeKeyAsset.IMGRankItem,
      SafeKeyAsset.IMGRankItem,
      SafeKeyAsset.IMGRankItem,
      SafeKeyAsset.IMGRankItem,
      SafeKeyAsset.IMGRankItem,
      SafeKeyAsset.IMGRankItem,
      SafeKeyAsset.IMGRankItem,
      SafeKeyAsset.IMGRankItem,
      SafeKeyAsset.IMGRankItem,
    ];

    for (let i = 0; i < rankItems.length; i++) {
      const rankItem = new pc.Entity(`RankItem-${i}`);
      rankItem.addComponent("element", {
        type: pc.ELEMENTTYPE_IMAGE,
        width: this.screenWidth * 0.8,
        height: this.screenHeight * 0.1,
        pivot: new pc.Vec2(0.5, 0.5),
        anchor: new pc.Vec4(0.5, 1 - (i) * 0.1, 0.5, 1 - i * 0.1),
      });
      rankItem.element!.texture = this.assetManager.getAsset(rankItems[i])
        .resource;

      parentEntity.addChild(rankItem);
    }
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
