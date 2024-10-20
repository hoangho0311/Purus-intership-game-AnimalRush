import * as pc from "playcanvas";
import { Character } from "./Character";
import { RoadManager } from "./RoadManager";
import { UIManager } from "./UIManager";

export class GameManager {
    app: pc.Application;
    character: Character;
    roadManager: RoadManager;
    uiManager: UIManager;
    assets: any;
    score: number;

    constructor(app: pc.Application, assets: any) {
        this.app = app;
        this.assets = assets;
        this.score = 0;

        this.character = new Character(app, assets);
        this.roadManager = new RoadManager(app, this.character.entity, 5, 2, 10, assets);
        this.uiManager = new UIManager(app);

        // Bắt đầu trò chơi
        this.startGame();
    }

    startGame() {
        this.character.changeState('run');
        this.app.on('update', this.update.bind(this));
    }

    update(dt: number) {
        this.character.update(dt);
        this.roadManager.update(dt);

        this.score += 1;
        this.uiManager.updateScore(this.score);

        if (this.character.isPlayerDead) {
            this.stopGame();
        }
    }

    stopGame() {
        console.log("Game Over");
        // this.uiManager.showGameOver();
        this.app.off('update', this.update);
    }
}
