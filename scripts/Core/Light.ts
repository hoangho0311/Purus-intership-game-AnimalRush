import * as pc from "playcanvas";

export function createLight(app) {
    const light = new pc.Entity("DirectionalLight");
    app.root.addChild(light);
    light.addComponent("light", {
        type: pc.LIGHTTYPE_DIRECTIONAL,
        color: new pc.Color(1, 1, 1),
        intensity: 1
    });
    light.setEulerAngles(-20, 0, 0);
}
