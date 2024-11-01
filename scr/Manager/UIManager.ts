import * as pc from 'playcanvas';
import { IUIController } from '..//Interface//IUIController'
import { PauseUI } from'..//UI/Pause/PauseUI'
import { InGameUI } from'..//UI/InGame/InGameUI'
import { LoseUI } from '../UI/Lose/LoseUI';
import { UIMainMenu } from '../UI/Menu/UIMainMenu';
import { UIShop } from '../UI/Shop/UIShop';
import { UIRank } from '../UI/Rank/UIRank';
import { Character } from '../Entities/Character';

export class UIManager extends pc.Entity {
    private app: pc.Application;
    private uiInGame!: InGameUI;
    private uiPauseGame!: PauseUI;
    private loseGameUI!: LoseUI;
    private uiMainMenu!: UIMainMenu;
    private uiShop!: UIShop;
    private uiRank!: UIRank;
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

        this.uiMainMenu = new UIMainMenu(this.app, this);
        this.addChild(this.uiMainMenu);
        this.uiMainMenu.Open();

        this.uiInGame = new InGameUI(this.app, this);
        this.addChild(this.uiInGame);
        this.uiInGame.Close();

        this.uiPauseGame = new PauseUI(this.app, this);
        this.addChild(this.uiPauseGame);
        this.uiPauseGame.Close();

        this.loseGameUI = new LoseUI(this.app, this);
        this.addChild(this.loseGameUI);
        this.loseGameUI.Close();

        this.uiShop = new UIShop(this.app, this);
        this.addChild(this.uiShop);
        this.uiShop.Close();

        this.uiRank = new UIRank(this.app, this);
        this.addChild(this.uiRank);
        this.uiRank.Close();

        this.currentUI = this.uiMainMenu;
    }


    openUIMainMenu() {
        this.app.fire("switchLight", "menu");
        this.app.fire("switchCamera", "menu");
        this.switchUI(this.uiMainMenu);
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

    openUIShop() {
        this.app.fire("switchLight", "shop");
        this.app.fire("switchCamera", "shop");
        this.switchUI(this.uiShop);
    }

    openUIRank() {
        this.switchUI(this.uiRank);
    }

    registerEvents() {
        this.app.on("UI:OpenMainMenu", this.openUIMainMenu, this);
        this.app.on("UI:OpenInGame", this.openUIInGame, this);
        this.app.on("UI:OpenPauseGame", this.openUIPauseGame, this);
        this.app.on("UI:OpenLoseGame", this.openUILoseGame, this);
        this.app.on("UI:OpenShop", this.openUIShop, this);
        this.app.on("UI:OpenRank", this.openUIRank, this);
    }

    private switchUI(newUI: IUIController) {
        if (this.currentUI) {
            this.currentUI.Close();
        }
        this.currentUI = newUI;
        this.currentUI.Open();
    }
}
