import * as pc from "playcanvas";
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";

export class UIText {
    entity: pc.Entity;
    private textEntity: pc.Entity;

    constructor(
        app: pc.Application,
        assetManager: AssetManager,
        text: string,
        size: pc.Vec2,
        position: pc.Vec2,
        fontSize: number,
        color: pc.Color = new pc.Color(1, 1, 1),
        texture?: pc.Asset,
        textPosition: pc.Vec2 = new pc.Vec2(0, 0)
    ) {
        this.entity = new pc.Entity("UIText");
        const fontAsset = assetManager.getAsset(SafeKeyAsset.Font);

        this.entity.addComponent("element", {
            anchor: [0.5, 0.5, 0.5, 0.5],
            height: size.y,
            pivot: [0.5, 0.5],
            type: pc.ELEMENTTYPE_IMAGE,
            width: size.x,
            useInput: true,
        });

        if (texture) {
            this.entity.element!.texture = texture.resource;
        }

        this.textEntity = new pc.Entity("text");
        this.textEntity.addComponent("element", {
            type: pc.ELEMENTTYPE_TEXT,
            pivot: [0.5, 0.5],
            anchor: [0.5, 0.5, 0.5, 0.5],
            fontAsset: fontAsset!.id,
            fontSize: fontSize,
            height: 64,
            width: 128,
            wrapLines: true,
            text: text,
            color: color,
        });
        this.textEntity.setLocalPosition(textPosition.x, textPosition.y, 0);

        this.entity.addChild(this.textEntity);
        this.entity.setLocalPosition(position.x, position.y, 0);
    }

    setText(newText: string) {
        this.textEntity.element.text = newText;
    }
}

