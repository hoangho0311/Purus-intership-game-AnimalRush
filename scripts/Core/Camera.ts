import * as pc from "playcanvas";

export function createCamera(app: pc.Application, character: pc.Entity): pc.Entity {
  const cameraEntity = new pc.Entity("MainCamera");
  app.root.addChild(cameraEntity);

  cameraEntity.addComponent("camera", {
    clearColor: new pc.Color(66 / 255, 135 / 255, 245 / 255),
  });

  const cameraOffset = new pc.Vec3(10, 30, -10);

  // Update camera position based on the character position
  app.on("update", () => {
    if (character) {
      const characterPosition = character.getPosition();
      const cameraPosition = new pc.Vec3().add2(characterPosition, cameraOffset);
      cameraEntity.setPosition(cameraPosition);
      cameraEntity.lookAt(characterPosition);
    }
  });

  return cameraEntity;
}
