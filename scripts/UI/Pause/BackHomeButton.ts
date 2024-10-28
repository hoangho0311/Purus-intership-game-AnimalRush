import * as pc from "playcanvas";
import { UIButton } from "../Common/UIButton";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { GameManager } from "../../Manager/GameManager";
import { SoundManager } from "../../Manager/SoundManager";

export class BackHomeButton extends UIButton {
  constructor(
    app: pc.Application,
    position: pc.Vec2,
    sizeButton: pc.Vec2,
    assetManager: AssetManager
  ) {
    const buttonTexture = assetManager.getAsset(SafeKeyAsset.IMGButtonBackHome);
    const fontAsset = assetManager.getAsset(SafeKeyAsset.Font);

    super(
      app,
      position,
      sizeButton,
      "HOME",
      fontAsset!,
      buttonTexture,
      new pc.Vec2(25, 0)
    );

    this.setupClickListener();
  }

  private setupClickListener() {
    this.entity.button?.on("click", () => {
      SoundManager.getInstance().playSoundByKey(SafeKeyAsset.BackGroundMusic);
      GameManager.getInstance().stopGame();
      this.app.fire("UI:OpenMainMenu");
    });
  }
}
