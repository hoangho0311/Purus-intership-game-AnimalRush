import * as pc from "playcanvas";
import { UIButton } from "../Common/UIButton";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { GameManager } from "../../Manager/GameManager";
import * as TWEEN from "@tweenjs/tween.js";

export class PanelStartGame extends UIButton {
  constructor(
    app: pc.Application,
    position: pc.Vec2,
    sizeButton: pc.Vec2,
    assetManager: AssetManager
  ) {
    const buttonTexture = assetManager.getAsset(SafeKeyAsset.IMGBackGroundTransparent);
    const fontAsset = assetManager.getAsset(SafeKeyAsset.Font);

    super(
      app,
      position,
      sizeButton,
      "",
      fontAsset!,
      buttonTexture,
      new pc.Vec2(25, 0)
    );
    this.setupClickListener();
  }

  private setupClickListener() {
    this.entity.button?.on("click", () => {
      GameManager.getInstance().startGame();
      this.app.fire("UI:OpenInGame");
    });
  }

}
