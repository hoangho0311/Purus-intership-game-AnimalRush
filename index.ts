import * as pc from "playcanvas";
import { createCamera } from "./scripts/Core/Camera.ts";
import { createLight } from "./scripts/Core/Light.ts";
import { Character } from "./scripts/Entities/Character.ts";
import { RoadManager } from "./scripts/Manager/RoadManager.ts";
import { UIManager } from "./scripts/Manager/UIManager.ts";
import { InputHandler } from "./scripts/Input/InputHandler .ts";
import { GameManager } from "./scripts/Manager/GameManager.ts";
import { AssetManager } from "./scripts/Manager/AssetManager.ts";
import { SafeKeyAsset } from "./scripts/Helper/SafeKeyAsset";
import { CurvedWorld } from "./scripts/Core/CurvedWorld.ts";
import { Skybox } from "./scripts/Core/Skybox.ts";
import { SoundManager } from "./scripts/Manager/SoundManager.ts";

const rootPath = "./scr/lib/AmmoJS/Utils";
window.focus();

//#region Ammo
pc.WasmModule.setConfig("Ammo", {
  glueUrl: rootPath + "/ammo.wasm.js",
  wasmUrl: rootPath + "/ammo.wasm.wasm",
  fallbackUrl: rootPath + "/ammo.js",
});
await new Promise((resolve) => {
  pc.WasmModule.getInstance("Ammo", () => resolve());
});
//#endregion

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const device = await pc.createGraphicsDevice(canvas);
device.maxPixelRatio = Math.min(window.devicePixelRatio, 2);

const app = new pc.Application(canvas, {
  keyboard: new pc.Keyboard(window),
  mouse: new pc.Mouse(canvas),
  touch: new pc.TouchDevice(canvas),
  elementInput: new pc.ElementInput(canvas),
});

app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

const setCanvasSize = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (!isMobile) {
    const canvasWidth = screenWidth / 3;
    const canvasHeight = screenHeight;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.left = `${(screenWidth - canvasWidth) / 2}px`;
    canvas.style.top = "0px";
  }
  canvas.style.position = "absolute";
};
setCanvasSize();
const resize = () => app.resizeCanvas();
window.addEventListener('resize', resize);
window.addEventListener('resize', setCanvasSize);
app.on('destroy', () => {
  window.removeEventListener('resize', resize);
});
app.start();
app.systems.rigidbody!.gravity.set(0, -15.81, 0);

const assetManager = AssetManager.getInstance();
assetManager.on("assetsLoaded", onAssetsLoaded, this);
assetManager.loadAssets(app);

function onAssetsLoaded() {
  const inputHandler = new InputHandler(app);
  const gameManager = GameManager.getInstance();
  const character = new Character(app, assetManager, inputHandler);

  const cameraEntity = createCamera(app, character.entity);
  cameraEntity.name = "Camera";

  const lightEntity = createLight(app);
  
  const roadManager = new RoadManager(app, character, 7, 1, 72);
  gameManager.setRoadManager(roadManager);
  gameManager.SetPlayer(character);

  const uiManager = new UIManager(app, character);

  const curvedWorld = new CurvedWorld(app);
  curvedWorld.setupCurvedWorld();

  const skybox = new Skybox(app);

  const soundManager = SoundManager.getInstance(app);
  soundManager.playSoundByKey(SafeKeyAsset.BackGroundMusic, true)

  app.on("update", (dt) => {
    uiManager.registerEvents();
    if (gameManager.isPaused() || gameManager.isOver()) return;
    character.update(dt);
    gameManager.updateTime(dt);
    if (gameManager.isStarted()) {
      roadManager.update(dt);
    }
  });
}
