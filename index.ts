import * as pc from "playcanvas";
import { createCamera } from "./scripts/Core/Camera.ts";
import { createLight } from "./scripts/Core/Light.ts";
import { Character } from "./scripts/Entities/Character.ts";
import { RoadManager } from "./scripts/Manager/RoadManager.ts";
import { UIManager } from "./scripts/UI/UIManager.ts";

const rootPath = "./scr/lib/AmmoJS/Utils";
window.focus();

//#region  Ammo
pc.WasmModule.setConfig("Ammo", {
  glueUrl: rootPath + "/ammo.wasm.js",
  wasmUrl: rootPath + "/ammo.wasm.wasm",
  fallbackUrl: rootPath + "/ammo.js",
});
// Wait for Ammo.js to load completely
await new Promise((resolve) => {
  pc.WasmModule.getInstance("Ammo", () => resolve());
});
//#endregion

// Setup application
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const app = new pc.Application(canvas, {
  keyboard: new pc.Keyboard(window), // Đảm bảo keyboard input được khởi tạo
  mouse: new pc.Mouse(canvas),
});
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);
window.addEventListener("resize", () => app.resizeCanvas());
app.start();
// Use AssetListLoader to load the character
const assets = {
  charModelAsset: new pc.Asset("model_purus", "model", {
    url: "../../assets/models/Chibi_Cat.glb",
  }),
  charColorTextureAsset: new pc.Asset("tex_purus", "texture", {
    url: "../../assets/textures/CatColor/T_Chibi_Cat_02.png",
  }),
  charEmotionsTextureAsset: new pc.Asset("tex_purus", "texture", {
    url: "../../assets/textures/Emotions/T_Chibi_Emo_01.png",
  }),
  charIdleAnimationAsset: new pc.Asset("anim_purus_idle", "animation", {
    url: "../../assets/animations/Cat/Anim_Chibi@IdleA.glb",
  }),
  charDeathAnimationAsset: new pc.Asset("anim_purus_death", "animation", {
    url: "../../assets/animations/Cat/Anim_Chibi@DieA.glb",
  }),
  charRunAnimationAsset: new pc.Asset("anim_purus_run", "animation", {
    url: "../../assets/animations/Cat/Anim_Chibi@Run.glb",
  }),
  charJumpAnimationAsset: new pc.Asset("anim_purus_jump", "animation", {
    url: "../../assets/animations/Cat/Anim_Chibi@Jump.glb",
  }),
  obstacleAsset1: new pc.Asset("rockModel", "model", {
    url: "../../assets/models/Map/obstacle_7_001.glb",
  }),
  itemAsset1: new pc.Asset("starModel", "model", {
    url: "../../assets/models/Map/candy_001.glb",
  }),
  font: new pc.Asset("font", "font", { url: rootPath + "/courier.json" }),
};

const assetListLoader = new pc.AssetListLoader(
  Object.values(assets),
  app.assets
);
assetListLoader.load(() => {
  app.systems.rigidbody!.gravity.set(0, -15.81, 0);
  // Create character
  const character = new Character(app, assets);

  // Setup camera to follow the character
  const cameraEntity = createCamera(app, character.entity);
  const lightEntity = createLight(app);
  const roadManager = new RoadManager(app, character, 5, 7, 30, assets);

  const uiManager = new UIManager(app, assets.font);

  let score = 0;

  app.on("update", (dt) => {
    character.update(dt);
    roadManager.update(dt);

    // score += Math.floor(dt * 100);
    // uiManager.updateScore(score);
  });
});
