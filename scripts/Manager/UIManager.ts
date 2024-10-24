import * as pc from "playcanvas";
import { LoseUI } from "../UI/Lose/LoseUI";
import { PauseUI } from "../UI/Pause/PauseUI";
import { InGameUI } from "../UI/InGame/InGameUI";
import { GameManager } from "./GameManager";

export class UIManager {
    static instance: UIManager;
    app: pc.Application;
    screen: pc.Entity;
    loseUI: LoseUI;
    pauseUI: PauseUI;
    inGameUI: InGameUI;

    constructor(app: pc.Application) {
        this.app = app;
        this.loseUI = new LoseUI(app);
        this.pauseUI = new PauseUI(app);
        this.inGameUI = new InGameUI(app);

        this.showInGameUI();
    }

    public static getInstance(app?: pc.Application): UIManager {
        if (!UIManager.instance) {
            UIManager.instance = new UIManager(app!);
        }
        return UIManager.instance;
    }

    update(dt: number) {
        this.inGameUI.updateScore();
        this.inGameUI.updateDistance();
        this.inGameUI.updateTime();
    }

    showInGameUI(){
        this.hideAll();
        this.inGameUI.show();
    }

    showLoseUI() {
        this.hideAll();
        this.loseUI.show();
        this.loseUI.updateDistanceText();
        this.loseUI.updateScoreText();
        this.loseUI.updateTimeText();
    }

    showPauseUI() {
        this.hideAll();
        this.pauseUI.show();
    }

    hideAll() {
        this.loseUI.hide();
        this.pauseUI.hide();
        this.inGameUI.hide();
    }
}
