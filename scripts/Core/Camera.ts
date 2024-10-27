import * as pc from "playcanvas";

export function createCamera(app: pc.Application, character: pc.Entity): pc.Entity {
    const cameraEntity = new pc.Entity("MainCamera");
    app.root.addChild(cameraEntity);

    cameraEntity.addComponent("camera", {
        clearColor: new pc.Color(66 / 255, 135 / 255, 245 / 255),
    });

    const positions = {
        menu: new pc.Vec3(-2, 2, 10), 
        shop: new pc.Vec3(0, 0, 15),
        game: new pc.Vec3(0, 7, -20)
    };

    let targetPosition = positions.menu.clone();
    let currentPosition = positions.menu.clone();
    const transitionSpeed = 0.05;

    function switchCameraPosition(mode: "menu" | "shop" | "game") {
        targetPosition = positions[mode].clone();
    }

    app.on("switchCamera", switchCameraPosition);
    const characterPosition = character.getPosition();
    const py = characterPosition.y;
    app.on("update", (dt) => {
        if (character) {
           
            currentPosition.lerp(currentPosition, targetPosition, transitionSpeed);

            const cameraPosition = new pc.Vec3(
                currentPosition.x,
                currentPosition.y,
                characterPosition.z + currentPosition.z
            );

            cameraEntity.setPosition(cameraPosition);

            const lookAtPosition = new pc.Vec3(
                characterPosition.x,
                py + 2,
                characterPosition.z
            );

            cameraEntity.lookAt(0, lookAtPosition.y, lookAtPosition.z);
        }
    });

    return cameraEntity;
}
