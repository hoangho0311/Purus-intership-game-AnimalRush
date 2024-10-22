import * as pc from "playcanvas";

export function createCamera(app: pc.Application, character: pc.Entity): pc.Entity {
    const cameraEntity = new pc.Entity("MainCamera");
    app.root.addChild(cameraEntity);

    cameraEntity.addComponent("camera", {
        clearColor: new pc.Color(66 / 255, 135 / 255, 245 / 255),
    });

    const initialPosition = new pc.Vec3(0, 10, -20);
    cameraEntity.setPosition(initialPosition);

    app.on("update", () => {
        if (character) {
            const characterPosition = character.getPosition();

            const cameraPosition = new pc.Vec3(
              initialPosition.x,
              initialPosition.y,
              characterPosition.z + initialPosition.z
            );

            cameraEntity.setPosition(cameraPosition);

            cameraEntity.lookAt(0, 3, characterPosition.z);
        }
    });

    return cameraEntity;
}
