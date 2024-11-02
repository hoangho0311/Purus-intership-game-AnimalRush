import * as pc from "playcanvas";
import { UIButton } from "../Common/UIButton";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { UIManager } from "../../Manager/UIManager";
import { GameManager } from "../../Manager/GameManager";
import { SoundManager } from "../../Manager/SoundManager";

export class BackToHomeButton extends UIButton {
  constructor(
    app: pc.Application,
    position: pc.Vec2,
    assetManager: AssetManager
  ) {
    const buttonTexture = assetManager.getAsset(SafeKeyAsset.IMGBlueButton);
    const fontAsset = assetManager.getAsset(SafeKeyAsset.Font);

    super(
      app,
      position,
      new pc.Vec2(app.graphicsDevice.width / 3, app.graphicsDevice.width / 7),
      "HOME",
      fontAsset!,
      buttonTexture,
      new pc.Vec2(0, 0)
    );

    this.setupClickListener();
  }

  private setupClickListener() {
    this.entity.button?.on("click", () => {
      SoundManager.getInstance().isMusicMuted = false;
      GameManager.getInstance().stopGame();
      SoundManager.getInstance().playMusic();
      setTimeout(() => {
        this.app.fire("UI:OpenMainMenu");
      }, 100);
    });
  }
}
