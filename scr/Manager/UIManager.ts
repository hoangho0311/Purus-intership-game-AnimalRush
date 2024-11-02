import * as pc from 'playcanvas';
import { IUIController } from '..//Interface//IUIController'
import { PauseUI } from'..//UI/Pause/PauseUI'
import { InGameUI } from'..//UI/InGame/InGameUI'
import { LoseUI } from '../UI/Lose/LoseUI';
import { CountDownUI } from '../UI/CountDown/CountDownUI';
import { MainMenuUI } from '../UI/Menu/MainMenuUI';
import { ShopUI } from '../UI/Shop/ShopUI';
import { RankUI } from '../UI/Rank/RankUI';
import { SettingUI } from '../UI/MenuSetting/SettingUI';
import { Character } from '../Entities/Character';

export class UIManager extends pc.Entity {
    private app: pc.Application;
    private uiInGame!: InGameUI;
    private uiPauseGame!: PauseUI;
    private loseGameUI!: LoseUI;
    private countdownUI!: CountDownUI;
    private mainMenuUI!: MainMenuUI;
    private shopUI!: ShopUI;
    private rankUI!: RankUI;
    private settingUI: SettingUI;
    private currentUI!: IUIController;
    character: Character;

    constructor(app: pc.Application, character: Character) {
        super();
        this.app = app;
        this.character = character;
        this.setupUI();
        this.registerEvents();
    }

    private setupUI() {
        // Add screen component for UI management
        this.addComponent('screen', {
            referenceResolution: new pc.Vec2(this.app.graphicsDevice.width, this.app.graphicsDevice.height),
            scaleBlend: 0,
            scaleMode: pc.SCALEMODE_BLEND,
            screenSpace: true,
        });
        this.app.root.addChild(this);

        this.mainMenuUI = new MainMenuUI(this.app, this);
        this.addChild(this.mainMenuUI);
        this.mainMenuUI.Open();

        this.uiInGame = new InGameUI(this.app, this);
        this.addChild(this.uiInGame);
        this.uiInGame.Close();

        this.uiPauseGame = new PauseUI(this.app, this);
        this.addChild(this.uiPauseGame);
        this.uiPauseGame.Close();

        this.loseGameUI = new LoseUI(this.app, this);
        this.addChild(this.loseGameUI);
        this.loseGameUI.Close();

        this.shopUI = new ShopUI(this.app, this);
        this.addChild(this.shopUI);
        this.shopUI.Close();

        this.rankUI = new RankUI(this.app, this);
        this.addChild(this.rankUI);
        this.rankUI.Close();

        this.countdownUI = new CountDownUI(this.app, this);
        this.addChild(this.countdownUI);
        this.countdownUI.Close();

        this.settingUI = new SettingUI(this.app, this);
        this.addChild(this.settingUI);
        this.settingUI.Close();

        this.currentUI = this.mainMenuUI;
    }


    openmainMenuUI() {
        this.app.fire("switchLight", "menu");
        this.app.fire("switchCamera", "menu");
        this.switchUI(this.mainMenuUI);
    }

    openUIInGame() {
        this.app.fire("switchLight", "game");
        this.app.fire("switchCamera", "game");
        this.switchUI(this.uiInGame);
    }

    openUIPauseGame() {
        this.switchUI(this.uiPauseGame);
    }

    openUILoseGame() {
        this.switchUI(this.loseGameUI);
    }

    openshopUI() {
        this.app.fire("switchLight", "shop");
        this.app.fire("switchCamera", "shop");
        this.switchUI(this.shopUI);
    }

    openrankUI() {
        this.switchUI(this.rankUI);
    }

    openUICountDown() {
        this.switchUI(this.countdownUI);
        this.countdownUI.startCountdown();
    }

    opensettingsettingUIUI() {
        this.switchUI(this.settingUI);
    }

    registerEvents() {
        this.app.on("UI:OpenMainMenu", this.openmainMenuUI, this);
        this.app.on("UI:OpenInGame", this.openUIInGame, this);
        this.app.on("UI:OpenPauseGame", this.openUIPauseGame, this);
        this.app.on("UI:OpenLoseGame", this.openUILoseGame, this);
        this.app.on("UI:OpenShop", this.openshopUI, this);
        this.app.on("UI:OpenRank", this.openrankUI, this);
        this.app.on("UI:OpenUICountDown", this.openUICountDown, this);
        this.app.on("UI:OpenSettingMenu", this.opensettingsettingUIUI, this);
    }

    private switchUI(newUI: IUIController) {
        if (this.currentUI) {
            this.currentUI.Close();
        }
        this.currentUI = newUI;
        this.currentUI.Open();
    }
}
