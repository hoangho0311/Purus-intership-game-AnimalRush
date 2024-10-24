import * as pc from "playcanvas";
import { createCamera } from "./scripts/Core/Camera.ts";
import { createLight } from "./scripts/Core/Light.ts";
import { Character } from "./scripts/Entities/Character.ts";
import { RoadManager } from "./scripts/Manager/RoadManager.ts";
import { UIManager } from "./scripts/Manager/UIManager.ts";
import { InputHandler } from "./scripts/Input/InputHandler .ts";
import { GameManager } from "./scripts/Manager/GameManager.ts";
import { AssetManager } from "./scripts/Manager/AssetManager.ts";

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

  if (isMobile) {
      canvas.style.width = `${screenWidth}px`;
      canvas.style.height = `${screenHeight}px`;
      canvas.width = screenWidth;
      canvas.height = screenHeight;

      canvas.style.left = "0px";
      canvas.style.top = "0px";
  } else {
      const canvasWidth = screenWidth / 2.5;
      const canvasHeight = screenHeight;

      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      canvas.style.left = `${(screenWidth - canvasWidth) / 2}px`;
      canvas.style.top = `0px`;
  }

  canvas.style.position = "absolute";
};
setCanvasSize();
// window.addEventListener("resize", () => {
//   app.resizeCanvas();
// });
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
  const lightEntity = createLight(app);
  const roadManager = new RoadManager(app, character, 8, 1, 30);
  gameManager.setRoadManager(roadManager);
  gameManager.setPlayer(character);
  const uiManager = new UIManager(app);

  app.on("update", (dt) => {
    if(gameManager.isPaused() || gameManager.isOver()) return;
    character.update(dt);
    uiManager.update(dt);
    gameManager.updateTime(dt);
    if (gameManager.isStarted()){
      roadManager.update(dt);
    }
  });
}
