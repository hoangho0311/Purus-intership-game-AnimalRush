import * as pc from "playcanvas";

export class UIManager {
    app: pc.Application;
    screen: pc.Entity;
    scoreText: pc.Entity;
    settingButton: pc.Entity;
    score: number;

    constructor(app: pc.Application, fontAsset: pc.Asset) {
        this.app = app;
        this.score = 0;

        // Tạo màn hình UI
        this.screen = new pc.Entity();
        this.screen.addComponent('screen', {
            referenceResolution: new pc.Vec2(1280, 720),
            scaleBlend: 0.5,
            scaleMode: pc.SCALEMODE_BLEND,
            screenSpace: true,
        });
        this.app.root.addChild(this.screen);

        // Tạo các thành phần UI
        this.createScoreText(fontAsset);
        this.createSettingButton(fontAsset);
    }

    createScoreText(fontAsset: pc.Asset) {
        // Tạo Text hiển thị điểm số
        this.scoreText = new pc.Entity("ScoreText");
        this.scoreText.setLocalPosition(10, -10, 0);
        this.scoreText.addComponent('element', {
            pivot: new pc.Vec2(0, 1),
            anchor: new pc.Vec4(0, 1, 0, 1),
            fontAsset: fontAsset.id,
            fontSize: 32,
            color: new pc.Color(0, 0, 0),
            text: 'Score: 0',
            type: pc.ELEMENTTYPE_TEXT,
        });
        this.screen.addChild(this.scoreText);
    }

    createSettingButton(fontAsset: pc.Asset) {
        this.settingButton = new pc.Entity("SettingButton");
        this.settingButton.setLocalPosition(-10, -10, 0);
        this.settingButton.addComponent('element', {
            pivot: new pc.Vec2(1, 1),
            anchor: new pc.Vec4(1, 1, 1, 1),
            fontAsset: fontAsset.id,
            fontSize: 24,
            type: pc.ELEMENTTYPE_TEXT,
            text: 'Settings',
            color: new pc.Color(0, 0, 0),
        });
        this.screen.addChild(this.settingButton);

        this.settingButton.element!.on('click', () => {
            console.log("ok")
            this.openSettingsMenu();
        });
    }

    updateScore(newScore: number) {
        this.score = newScore;
        this.scoreText.element!.text = `Score: ${this.score}`;
    }

    openSettingsMenu() {
        const settingsPopup = new pc.Entity("SettingsPopup");
        settingsPopup.addComponent('element', {
            type: 'group',
            anchor: [0.5, 0.5, 0.5, 0.5],
            pivot: [0.5, 0.5],
            width: 400,
            height: 300,
        });
        this.screen.addChild(settingsPopup);

        const closeButton = new pc.Entity("CloseButton");
        closeButton.addComponent('element', {
            type: 'text',
            text: 'Close',
            fontSize: 24,
            pivot: [0.5, 0.5],
            anchor: [0.5, 0.1, 0.5, 0.1],
            color: new pc.Color(1, 0, 0),
        });
        settingsPopup.addChild(closeButton);

        closeButton.element!.on('click', () => {
            settingsPopup.destroy();
        });
    }
}
