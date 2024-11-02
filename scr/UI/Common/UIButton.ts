import * as pc from "playcanvas";

export class UIButton {
    app: pc.Application;
    entity: pc.Entity;
    onClickCallback?: () => void;

    constructor(
        app: pc.Application,
        position: pc.Vec2,
        size: pc.Vec2,
        text: string,
        fontAsset: pc.Asset,
        texture?: pc.Asset,
        labelPosition: pc.Vec2 = new pc.Vec2(0, 0)
    ) {
        this.app = app;
        this.entity = new pc.Entity("UIButton");

        this.entity.addComponent("button", {
            active: true,
            transitionMode: pc.BUTTON_TRANSITION_MODE_SPRITE_CHANGE
        });


        if (texture) {
            this.entity.addComponent("element", {
                anchor: [0.5, 0.5, 0.5, 0.5],
                height: size.y,
                pivot: [0.5, 0.5],
                type: pc.ELEMENTTYPE_IMAGE,
                width: size.x,
                useInput: true,
            });
            this.entity.element!.texture = texture.resource;
        }

        const label = new pc.Entity("ButtonLabel");
        label.addComponent("element", {
            anchor: [0.5, 0.5, 0.5, 0.5],
            color: new pc.Color(1, 1, 1),
            fontAsset: fontAsset.id,
            fontSize: this.app.graphicsDevice.width/18,
            height: 64,
            pivot: [0.5, 0.5],
            text: text,
            type: pc.ELEMENTTYPE_TEXT,
            width: 128,
            wrapLines: true,
        });

        label.setLocalPosition(labelPosition.x, labelPosition.y, 0);
        
        this.entity.addChild(label);
        this.entity.setLocalPosition(position.x, position.y, 0);

        this.entity.element!.on("click", () => {
            if (this.onClickCallback) {
                this.onClickCallback();
            }
        });
    }

    onClick(callback: () => void) {
        this.onClickCallback = callback;
    }
}
