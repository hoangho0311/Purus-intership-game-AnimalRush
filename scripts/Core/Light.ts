import * as pc from "playcanvas";

export function createLight(app: pc.Application): pc.Entity {
    const light = new pc.Entity("DirectionalLight");
    app.root.addChild(light);

    light.addComponent("light", {
        type: pc.LIGHTTYPE_DIRECTIONAL,
        color: new pc.Color(1, 1, 1),
        intensity: 1
    });

    light.setEulerAngles(50, 0, 0);

    function updateLightRotation(mode: "menu" | "shop" | "game") {
        switch (mode) {
            case "menu":
                light.setEulerAngles(50, 0, 0);
                break;
            case "shop":
                light.setEulerAngles(70, 0, 0);
                break;
            case "game":
                light.setEulerAngles(-50, 0, 0);
                break;
        }
    }

    app.on("switchLight", updateLightRotation);

    return light;
}
