import * as pc from "playcanvas";
import { AssetManager } from "../Manager/AssetManager";
import { SafeKeyAsset } from "../Helper/SafeKeyAsset";

export class Skybox {
  app: pc.Application;

  constructor(app: pc.Application) {
    this.app = app;
    this.setupSkybox();
  }

  private setupSkybox() {
    const assetManager = AssetManager.getInstance();
    const skyboxAsset = assetManager.getAsset(
      SafeKeyAsset.SkyboxAsset
    ) as pc.Asset;

    if (skyboxAsset && skyboxAsset.resources[1]) {
      this.app.scene.skyboxMip = 15;
      this.app.scene.skybox = skyboxAsset.resources[1];
      this.app.scene.skyboxIntensity = 2;
      this.app.scene.skyboxRotation = new pc.Quat().setFromEulerAngles(0, 0, 0);
    }
  }
}
