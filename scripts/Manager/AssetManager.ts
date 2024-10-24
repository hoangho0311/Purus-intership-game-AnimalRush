import * as pc from 'playcanvas';
import { SafeKeyAsset } from '../Helper/SafeKeyAsset';

export class AssetManager {
    private static instance: AssetManager;
    private holderAsset: Map<string, pc.Asset> = new Map<string, pc.Asset>();
    private eventHandler: pc.EventHandler;

    private constructor() {
        this.eventHandler = new pc.EventHandler();
    }

    public static getInstance() {
        if (AssetManager.instance == null) {
            AssetManager.instance = new AssetManager();
        }
        return AssetManager.instance;
    }

    public getAsset(keyAsset: string): pc.Asset | undefined {
        return this.holderAsset.get(keyAsset);
    }

    public loadAssets(app: pc.Application): void {
        const listAsset = {
            [SafeKeyAsset.CharModelAsset]: new pc.Asset("model_purus", "model", {
                url: "../../assets/models/Chibi_Cat.glb",
            }),
            [SafeKeyAsset.CharColorTextureAsset]: new pc.Asset("tex_purus", "texture", {
                url: "../../assets/textures/CatColor/T_Chibi_Cat_02.png",
            }),
            [SafeKeyAsset.CharEmotionsTextureAsset]: new pc.Asset("tex_purus", "texture", {
                url: "../../assets/textures/Emotions/T_Chibi_Emo_01.png",
            }),
            [SafeKeyAsset.CharIdleAnimationAsset]: new pc.Asset("anim_purus_idle", "animation", {
                url: "../../assets/animations/Cat/Anim_Chibi@IdleA.glb",
            }),
            [SafeKeyAsset.CharDeathAnimationAsset]: new pc.Asset("anim_purus_death", "animation", {
                url: "../../assets/animations/Cat/Anim_Chibi@DieA.glb",
            }),
            [SafeKeyAsset.CharRunAnimationAsset]: new pc.Asset("anim_purus_run", "animation", {
                url: "../../assets/animations/Cat/Anim_Chibi@Run.glb",
            }),
            [SafeKeyAsset.CharJumpAnimationAsset]: new pc.Asset("anim_purus_jump", "animation", {
                url: "../../assets/animations/Cat/Anim_Chibi@Jump.glb",
            }),
            [SafeKeyAsset.ObstacleAsset1]: new pc.Asset("obstacleModel1", "model", {
                url: "../../assets/models/Map/obstacle_7_001.glb",
            }),
            [SafeKeyAsset.ObstacleAsset9]: new pc.Asset("obstacleModel9", "model", {
                url: "../../assets/models/Map/obstacle_9_001.glb",
            }),
            [SafeKeyAsset.ObstacleAsset12]: new pc.Asset("obstacleModel12", "model", {
                url: "../../assets/models/Map/obstacle_12_001.glb",
            }),
            [SafeKeyAsset.ItemAsset1]: new pc.Asset("starModel", "model", {
                url: "../../assets/models/Map/coin_001.glb",
            }),
            [SafeKeyAsset.GroundAsset]: new pc.Asset("groundModel", "model", {
                url: "../../assets/models/Map/platform_candy_002.glb",
            }),
            [SafeKeyAsset.GroundTextureAsset]: new pc.Asset("tex_ground", "texture", {
                url: "../../assets/textures/Map/Textures3.png",
            }),
            [SafeKeyAsset.DecorationAsset1]: new pc.Asset("groundModel", "model", {
                url: "../../assets/models/Map/ground_009.glb",
            }),
            [SafeKeyAsset.Font]: new pc.Asset("font", "font", {
                url: "./scr/lib/AmmoJS/Utils/courier.json",
            }),
            [SafeKeyAsset.IMGBackGroundPaper]: new pc.Asset("backgroundPaper", "texture", {
                url: "../../assets/sprites/Shapes/Rectangle.png",
            }),
            [SafeKeyAsset.IMGBackGroundPause]: new pc.Asset("backgroundPause", "texture", {
                url: "../../assets/sprites/Panel/PausePanel.png",
            }),
            [SafeKeyAsset.IMGBackGroundLose]: new pc.Asset("backgroundLose", "texture", {
                url: "../../assets/sprites/Panel/LosePanel.png",
            }),

            //#region Button
            [SafeKeyAsset.IMGButtonClose]: new pc.Asset("imgButtonClose", "texture", {
                url: "../../assets/sprites/Icons/Error.png",
            }),
            [SafeKeyAsset.IMGButtonResume]: new pc.Asset("imgButtonResume", "texture", {
                url: "../../assets/sprites/Button/ResumeButton.png",
            }),
            [SafeKeyAsset.IMGButtonBackHome]: new pc.Asset("imgButtonBackHome", "texture", {
                url: "../../assets/sprites/Button/BackHomeButton.png",
            }),
            [SafeKeyAsset.IMGButtonSetting]: new pc.Asset("imgButtonResume", "texture", {
                url: "../../assets/sprites/Button/Settings-256.png",
            }),
            [SafeKeyAsset.IMGGrayButton]: new pc.Asset("imgGrayButton", "texture", {
                url: "../../assets/sprites/Button/GrayButton.png",
            }),
            [SafeKeyAsset.IMGBlueButton]: new pc.Asset("imgBlueButton", "texture", {
                url: "../../assets/sprites/Button/BlueButton.png",
            }),
            //#endregion

            [SafeKeyAsset.IMGCoinLabel]: new pc.Asset("imgCoinLabel", "texture", {
                url: "../../assets/sprites/InGame/CoinTotalText.png",
            }),
            [SafeKeyAsset.IMGDistanceLabel]: new pc.Asset("imgDistanceLabel", "texture", {
                url: "../../assets/sprites/InGame/DistanceText.png",
            }),
            [SafeKeyAsset.IMGTimeLabel]: new pc.Asset("imgTimeLabel", "texture", {
                url: "../../assets/sprites/InGame/TimeText.png",
            }),
        };

        const assetLoader = new pc.AssetListLoader(Object.values(listAsset), app.assets);
        assetLoader.load(() => {
            for (const [key, value] of Object.entries(listAsset)) {
                this.holderAsset.set(key, value);
            }
            this.eventHandler.fire('assetsLoaded');
        });
    }

    public on(eventName: string, callback: (...args: any[]) => void, scope?: any) {
        this.eventHandler.on(eventName, callback, scope);
    }
}
