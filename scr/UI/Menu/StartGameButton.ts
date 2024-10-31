import * as pc from "playcanvas";
import { UIButton } from "../Common/UIButton";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { GameManager } from "../../Manager/GameManager";
import * as TWEEN from "@tweenjs/tween.js";

export class StartGameButton extends UIButton {
  private scaleTween!: TWEEN.Tween;
  constructor(
    app: pc.Application,
    position: pc.Vec2,
    sizeButton: pc.Vec2,
    assetManager: AssetManager
  ) {
    const buttonTexture = assetManager.getAsset(SafeKeyAsset.IMGClickToPlay);
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
    this.setUpTween();

    app.on("update", () => {
      this.scaleTween.update();
    });
  }

  private setupClickListener() {
    this.entity.button?.on("click", () => {
      GameManager.getInstance().startGame();
      this.app.fire("UI:OpenInGame");
    });
  }

  private setUpTween() {
    const scaleState = { scale: 1 };
    this.scaleTween = new TWEEN.Tween(scaleState)
      .to({ scale: 1.1 }, 800)
      .easing(TWEEN.Easing.SineIn)
      .onUpdate(() => {
        this.entity.setLocalScale(
          scaleState.scale,
          scaleState.scale,
          scaleState.scale
        );
      })
      .yoyo(true)
      .repeat(Infinity)
      .repeatDelay(100)
      .start();
  }
}
