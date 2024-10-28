import * as pc from 'playcanvas';
import { SafeKeyAsset } from '../Helper/SafeKeyAsset';

export class AssetManager {
    private static instance: AssetManager;
    private holderAsset: Map<string, pc.Asset> = new Map<string, pc.Asset>();
    private eventHandler: pc.EventHandler;
    private materials: pc.StandardMaterial[] = [];

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
            [SafeKeyAsset.CharColorTextureAsset]: new pc.Asset("charColorTextureAsset", "texture", {
                url: "../../assets/textures/CatColor/T_Chibi_Cat_02.png",
            }),
            [SafeKeyAsset.CharColorTexture1Asset]: new pc.Asset("charColorTexture1Asset", "texture", {
                url: "../../assets/textures/CatColor/T_Chibi_Cat_01.png",
            }),
            [SafeKeyAsset.CharColorTexture2Asset]: new pc.Asset("charColorTexture2Asset", "texture", {
                url: "../../assets/textures/CatColor/T_Chibi_Cat_03.png",
            }),
            [SafeKeyAsset.CharColorTexture3Asset]: new pc.Asset("charColorTexture3Asset", "texture", {
                url: "../../assets/textures/CatColor/T_Chibi_Cat_04.png",
            }),
            [SafeKeyAsset.CharColorTexture4Asset]: new pc.Asset("charColorTexture4Asset", "texture", {
                url: "../../assets/textures/CatColor/T_Chibi_Cat_05.png",
            }),
            [SafeKeyAsset.CharColorTexture5Asset]: new pc.Asset("charColorTexture5Asset", "texture", {
                url: "../../assets/textures/CatColor/T_Chibi_Cat_06.png",
            }),
            [SafeKeyAsset.CharColorTexture6Asset]: new pc.Asset("charColorTexture6Asset", "texture", {
                url: "../../assets/textures/CatColor/T_Chibi_Cat_07.png",
            }),
            [SafeKeyAsset.CharColorTexture7Asset]: new pc.Asset("charColorTexture7Asset", "texture", {
                url: "../../assets/textures/CatColor/T_Chibi_Cat_08.png",
            }),
            [SafeKeyAsset.CharColorTexture8Asset]: new pc.Asset("charColorTexture8Asset", "texture", {
                url: "../../assets/textures/CatColor/T_Chibi_Cat_09.png",
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
            [SafeKeyAsset.HammerObstacleAsset]: new pc.Asset("hammerObstacleAsset", "model", {
                url: "../../assets/models/Map/obstacle_8_002.glb",
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
            [SafeKeyAsset.IMGBarTop]: new pc.Asset("imgBarTop", "texture", {
                url: "../../assets/sprites/Shop/barTopBG.png",
            }),
            [SafeKeyAsset.IMGBackHomeIcon]: new pc.Asset("imgBackHomeIcon", "texture", {
                url: "../../assets/sprites/Button/BackHomeIcon.png",
            }),
            [SafeKeyAsset.IMGClickToPlay]: new pc.Asset("imgClickToPlay", "texture", {
                url: "../../assets/sprites/Button/CLICKTOPLAY.png",
            }),
            [SafeKeyAsset.IMGShopButton]: new pc.Asset("imgShopButton", "texture", {
                url: "../../assets/sprites/Button/ShopButton.png",
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

            //Sky
            [SafeKeyAsset.SkyboxAsset]: new pc.Asset("skyAsset", "cubemap", {
                url: "../../assets/sprites/Sky/Sky.png",
            }),

            //#region particle
            [SafeKeyAsset.IMGRaindrop]: new pc.Asset("imgRaindrop", "texture", {
                url: "../../assets/sprites/Particle/Raindrop.png",
            }, { srgb: true }),
            //#endregion

            //#region Decorate
            [SafeKeyAsset.AirBalloonAsset]: new pc.Asset("airBalloonAsset", "model", {
                url: "../../assets/models/Decorate/air_balloon_001.glb",
            }),
            [SafeKeyAsset.IceCreamAsset]: new pc.Asset("iceCreamAsset", "model", {
                url: "../../assets/models/Decorate/ice_cream_001.glb",
            }),
            [SafeKeyAsset.Lollipop24Asset]: new pc.Asset("lollipop24Asset", "model", {
                url: "../../assets/models/Decorate/lollipop_024.glb",
            }),
            [SafeKeyAsset.Lollipop34Asset]: new pc.Asset("lollipop34Asset", "model", {
                url: "../../assets/models/Decorate/lollipop_034.glb",
            }),
            [SafeKeyAsset.GrassGroundAsset]: new pc.Asset("grassGroundAsset", "model", {
                url: "../../assets/models/Decorate/ground_011.glb",
            }),
            //#endregion

            //#region Sound
            [SafeKeyAsset.JumpSoundEffect]: new pc.Asset("jumpSoundEffect", "audio", {
                url: "../../assets/sound/jumpSoundEF.mp3",
            }),
            [SafeKeyAsset.CoinSoundEffect]: new pc.Asset("coinSoundEffect", "audio", {
                url: "../../assets/sound/coinSoundEF.mp3",
            }),
            [SafeKeyAsset.BackGroundMusic]: new pc.Asset("backGroundMusic", "audio", {
                url: "../../assets/sound/MusicBG.mp3",
            }),
            [SafeKeyAsset.LoseGameSoundEffect]: new pc.Asset("loseGameSoundEffect", "audio", {
                url: "../../assets/sound/LoseGameSoundEF.mp3",
            }),
            //#endregion

            [SafeKeyAsset.CloudAsset]: new pc.Asset("cloudAsset", "model", {
                url: "../../assets/models/Map/candy_001.glb",
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

    public getMaterials(): pc.StandardMaterial[] {
        return this.materials;
    }

    public addMaterial(material: pc.StandardMaterial) {
        this.materials.push(material);
    }
}
