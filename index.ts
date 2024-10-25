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
    const canvasWidth = screenWidth / 2.8;
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
  gameManager.setPlayer(character);

  const uiManager = new UIManager(app);

  SetupSkybox(app);
  setupCurvedWorld(app);

  app.on("update", (dt) => {
    if (gameManager.isPaused() || gameManager.isOver()) return;
    character.update(dt);
    uiManager.update(dt);
    gameManager.updateTime(dt);
    if (gameManager.isStarted()) {
      roadManager.update(dt);
    }
  });
}

function setupCurvedWorld(app) {
  const CurvedWorld = pc.createScript("curvedWorld");

  CurvedWorld.attributes.add("curvePower", {
    type: "number",
    default: 10,
    min: -50,
    max: 50,
    title: "Curve Power",
    description: "Determines the amount of curviness to be applied.",
  });

  CurvedWorld.prototype.initialize = function () {
    const assetManager = AssetManager.getInstance();

    this.materials = assetManager.getMaterials();

    this.activeCamera =
      this.app.root.findByName("Camera") ||
      this.app.root.findByType("camera")[0];

    this.materials.forEach((material) => this.updateShader(material));

    this.on("attr", () => {
      this.materials.forEach((material) => this.updateShaderUniforms(material));
    });
  };

  CurvedWorld.prototype.updateShader = function (material) {
    material.chunks.transformVS =
      "uniform vec3 curveDirection;\n" +
      "uniform float curvePower;\n" +
      "uniform vec3 curveCenterPos;\n" +
      "uniform vec3 curveCameraDirection;\n" +
      "#ifdef PIXELSNAP\n" +
      "uniform vec4 uScreenSize;\n" +
      "#endif\n" +
      "#ifdef MORPHING\n" +
      "uniform vec4 morph_weights_a;\n" +
      "uniform vec4 morph_weights_b;\n" +
      "#endif\n" +
      "#ifdef MORPHING_TEXTURE_BASED\n" +
      "uniform vec4 morph_tex_params;\n" +
      "vec2 getTextureMorphCoords() {\n" +
      "    float vertexId = morph_vertex_id;\n" +
      "    vec2 textureSize = morph_tex_params.xy;\n" +
      "    vec2 invTextureSize = morph_tex_params.zw;\n" +
      "    // turn vertexId into int grid coordinates\n" +
      "    float morphGridV = floor(vertexId * invTextureSize.x);\n" +
      "    float morphGridU = vertexId - (morphGridV * textureSize.x);\n" +
      "    // convert grid coordinates to uv coordinates with half pixel offset\n" +
      "    return (vec2(morphGridU, morphGridV) * invTextureSize) + (0.5 * invTextureSize);\n" +
      "}\n" +
      "#endif\n" +
      "#ifdef MORPHING_TEXTURE_BASED_POSITION\n" +
      "uniform highp sampler2D morphPositionTex;\n" +
      "#endif\n" +
      "mat4 getModelMatrix() {\n" +
      "    #ifdef DYNAMICBATCH\n" +
      "    return getBoneMatrix(vertex_boneIndices);\n" +
      "    #elif defined(SKIN)\n" +
      "    return matrix_model * getSkinMatrix(vertex_boneIndices, vertex_boneWeights);\n" +
      "    #elif defined(INSTANCING)\n" +
      "    return mat4(instance_line1, instance_line2, instance_line3, instance_line4);\n" +
      "    #else\n" +
      "    return matrix_model;\n" +
      "    #endif\n" +
      "}\n" +
      "vec4 getPosition() {\n" +
      "    dModelMatrix = getModelMatrix();\n" +
      "    vec3 localPos = vertex_position;\n" +
      "    #ifdef NINESLICED\n" +
      "    // outer and inner vertices are at the same position, scale both\n" +
      "    localPos.xz *= outerScale;\n" +
      "    // offset inner vertices inside\n" +
      "    // (original vertices must be in [-1;1] range)\n" +
      "    vec2 positiveUnitOffset = clamp(vertex_position.xz, vec2(0.0), vec2(1.0));\n" +
      "    vec2 negativeUnitOffset = clamp(-vertex_position.xz, vec2(0.0), vec2(1.0));\n" +
      "    localPos.xz += (-positiveUnitOffset * innerOffset.xy + negativeUnitOffset * innerOffset.zw) * vertex_texCoord0.xy;\n" +
      "    vTiledUv = (localPos.xz - outerScale + innerOffset.xy) * -0.5 + 1.0; // uv = local pos - inner corner\n" +
      "    localPos.xz *= -0.5; // move from -1;1 to -0.5;0.5\n" +
      "    localPos = localPos.xzy;\n" +
      "    #endif\n" +
      "    #ifdef MORPHING\n" +
      "    #ifdef MORPHING_POS03\n" +
      "    localPos.xyz += morph_weights_a[0] * morph_pos0;\n" +
      "    localPos.xyz += morph_weights_a[1] * morph_pos1;\n" +
      "    localPos.xyz += morph_weights_a[2] * morph_pos2;\n" +
      "    localPos.xyz += morph_weights_a[3] * morph_pos3;\n" +
      "    #endif // MORPHING_POS03\n" +
      "    #ifdef MORPHING_POS47\n" +
      "    localPos.xyz += morph_weights_b[0] * morph_pos4;\n" +
      "    localPos.xyz += morph_weights_b[1] * morph_pos5;\n" +
      "    localPos.xyz += morph_weights_b[2] * morph_pos6;\n" +
      "    localPos.xyz += morph_weights_b[3] * morph_pos7;\n" +
      "    #endif // MORPHING_POS47\n" +
      "    #endif // MORPHING\n" +
      "    #ifdef MORPHING_TEXTURE_BASED_POSITION\n" +
      "    // apply morph offset from texture\n" +
      "    vec2 morphUV = getTextureMorphCoords();\n" +
      "    vec3 morphPos = texture2D(morphPositionTex, morphUV).xyz;\n" +
      "    localPos += morphPos;\n" +
      "    #endif\n" +
      "    vec4 posW = dModelMatrix * vec4(localPos, 1.0);\n" +
      // --- START custom curve code
      "    float amountX = curveCameraDirection.x * pow(posW.x - curveCenterPos.x, 2.0);\n" +
      "    float amountY = curveCameraDirection.y * pow(posW.y - curveCenterPos.y, 2.0);\n" +
      "    float amountZ = curveCameraDirection.z * pow(posW.z - curveCenterPos.z, 2.0);\n" +
      "    float amountSum = (amountX * curveCameraDirection.x + amountY * curveCameraDirection.y + amountZ * curveCameraDirection.z) * curvePower;\n" +
      "    posW.y += -amountSum;\n" +
      // --- END custom curve code

      "    #ifdef SCREENSPACE\n" +
      "    posW.zw = vec2(0.0, 1.0);\n" +
      "    #endif\n" +
      "    dPositionW = posW.xyz;\n" +
      "    vec4 screenPos;\n" +
      "    #ifdef UV1LAYOUT\n" +
      "    screenPos = vec4(vertex_texCoord1.xy * 2.0 - 1.0, 0.5, 1);\n" +
      "    #else\n" +
      "    #ifdef SCREENSPACE\n" +
      "    screenPos = posW;\n" +
      "    #else\n" +
      "    screenPos = matrix_viewProjection * posW;\n" +
      "    #endif\n" +
      "    #ifdef PIXELSNAP\n" +
      "    // snap vertex to a pixel boundary\n" +
      "    screenPos.xy = (screenPos.xy * 0.5) + 0.5;\n" +
      "    screenPos.xy *= uScreenSize.xy;\n" +
      "    screenPos.xy = floor(screenPos.xy);\n" +
      "    screenPos.xy *= uScreenSize.zw;\n" +
      "    screenPos.xy = (screenPos.xy * 2.0) - 1.0;\n" +
      "    #endif\n" +
      "    #endif\n" +
      "    return screenPos;\n" +
      "}\n" +
      "vec3 getWorldPosition() {\n" +
      "    return dPositionW;\n" +
      "}\n";

    material.update();

    this.updateShaderUniforms(material);
  };

  CurvedWorld.prototype.updateShaderUniforms = function (material) {
    material.setParameter("curvePower", this.curvePower * 0.001);

    const cameraPos = this.activeCamera.getPosition();
    material.setParameter("curveCenterPos", [
      cameraPos.x,
      cameraPos.y,
      cameraPos.z,
    ]);

    const cameraDir = this.activeCamera.forward;
    material.setParameter("curveCameraDirection", [
      cameraDir.x,
      cameraDir.y,
      cameraDir.z,
    ]);
  };

  const curvedEntity = new pc.Entity("CurvedWorldEntity");
  app.root.addChild(curvedEntity);
  curvedEntity.addComponent("script");
  curvedEntity.script.create("curvedWorld", {
    attributes: {
      curvePower: 0.2, // Set the initial curve power
    },
  });
}

function SetupSkybox(app: pc.Application) {
  const assetManager = AssetManager.getInstance();

  const skyboxAsset = assetManager.getAsset(
    SafeKeyAsset.SkyboxAsset
  ) as pc.Asset;

  if (skyboxAsset && skyboxAsset.resources[1]) {
    app.scene.skyboxMip = 20;
    app.scene.skybox = skyboxAsset.resources[1];

    app.scene.skyboxIntensity = 2;
    app.scene.skyboxRotation = new pc.Quat().setFromEulerAngles(0, 0, 0);
  }
}
