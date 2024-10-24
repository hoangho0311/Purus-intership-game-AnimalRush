import * as pc from "playcanvas";

export class UIPanel {
    entity: pc.Entity;

    constructor(size: pc.Vec2, backgroundTexture?: pc.Asset) {
        this.entity = new pc.Entity("UIPanel");

        this.entity.addComponent("element", {
            type: "group",
            pivot: new pc.Vec2(0.5, 0.5),
            anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
            width: size.x,
            height: size.y,
        });

        const background = new pc.Entity("PanelBackground");

        if (backgroundTexture) {
            background.addComponent("element", {
                type: "image",
                pivot: new pc.Vec2(0.5, 0.5),
                anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
                width: size.x,
                height: size.y,
            });
            background.element!.texture = backgroundTexture.resource;
        }

        this.entity.addChild(background);
    }

    addChild(child: pc.Entity) {
        this.entity.addChild(child);
    }

    show() {
        this.entity.enabled = true;
    }

    hide() {
        this.entity.enabled = false;
    }
}
