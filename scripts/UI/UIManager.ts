import * as pc from "playcanvas";

export class UIManager {
    app: pc.Application;
    screen: pc.Entity;
    scoreText: pc.Entity;
    distanceText: pc.Entity;
    settingButton: pc.Entity;
    score: number;

    constructor(app: pc.Application, fontAsset: pc.Asset) {
        this.app = app;
        this.score = 0;

        this.screen = new pc.Entity();
        this.screen.addComponent('screen', {
            referenceResolution: new pc.Vec2(1280, 720),
            scaleBlend: 0.5,
            scaleMode: pc.SCALEMODE_BLEND,
            screenSpace: true,
        });
        this.app.root.addChild(this.screen);

        this.createCoinText(fontAsset);
        this.createDistanceText(fontAsset);
    }

    createCoinText(fontAsset: pc.Asset) {
        this.scoreText = new pc.Entity("ScoreText");
        this.scoreText.setLocalPosition(10, -10, 0);
        this.scoreText.addComponent('element', {
            pivot: new pc.Vec2(0, 1),
            anchor: new pc.Vec4(0, 1, 0, 1),
            fontAsset: fontAsset.id,
            fontSize: 32,
            color: new pc.Color(0, 0, 0),
            text: 'Coin: 0',
            type: pc.ELEMENTTYPE_TEXT,
        });
        this.screen.addChild(this.scoreText);
    }

    createDistanceText(fontAsset: pc.Asset) {
        this.distanceText = new pc.Entity("Distance");
        this.distanceText.setLocalPosition(10, -50, 0);
        this.distanceText.addComponent('element', {
            pivot: new pc.Vec2(0, 1),
            anchor: new pc.Vec4(0, 1, 0, 1),
            fontAsset: fontAsset.id,
            fontSize: 32,
            color: new pc.Color(0, 0, 0),
            text: 'Distance: 0',
            type: pc.ELEMENTTYPE_TEXT,
        });
        this.screen.addChild(this.distanceText);
    }

    updateCoin(newScore: number) {
        this.score = newScore;
        this.scoreText.element!.text = `Coin: ${this.score}`;
    }

    updateDistance(newDistance: number) {
        this.distanceText.element!.text = `Distance: ${Math.round(newDistance)}`;
    }
}
