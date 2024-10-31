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
                url: "models/Chibi_Cat.glb",
            }),
            [SafeKeyAsset.CharColorTextureAsset]: new pc.Asset("charColorTextureAsset", "texture", {
                url: "textures/CatColor/T_Chibi_Cat_02.png",
            }),
            [SafeKeyAsset.CharColorTexture1Asset]: new pc.Asset("charColorTexture1Asset", "texture", {
                url: "textures/CatColor/T_Chibi_Cat_01.png",
            }),
            [SafeKeyAsset.CharColorTexture2Asset]: new pc.Asset("charColorTexture2Asset", "texture", {
                url: "textures/CatColor/T_Chibi_Cat_03.png",
            }),
            [SafeKeyAsset.CharColorTexture3Asset]: new pc.Asset("charColorTexture3Asset", "texture", {
                url: "textures/CatColor/T_Chibi_Cat_04.png",
            }),
            [SafeKeyAsset.CharColorTexture4Asset]: new pc.Asset("charColorTexture4Asset", "texture", {
                url: "textures/CatColor/T_Chibi_Cat_05.png",
            }),
            [SafeKeyAsset.CharColorTexture5Asset]: new pc.Asset("charColorTexture5Asset", "texture", {
                url: "textures/CatColor/T_Chibi_Cat_06.png",
            }),
            [SafeKeyAsset.CharColorTexture6Asset]: new pc.Asset("charColorTexture6Asset", "texture", {
                url: "textures/CatColor/T_Chibi_Cat_07.png",
            }),
            [SafeKeyAsset.CharColorTexture7Asset]: new pc.Asset("charColorTexture7Asset", "texture", {
                url: "textures/CatColor/T_Chibi_Cat_08.png",
            }),
            [SafeKeyAsset.CharColorTexture8Asset]: new pc.Asset("charColorTexture8Asset", "texture", {
                url: "textures/CatColor/T_Chibi_Cat_09.png",
            }),
            [SafeKeyAsset.CharEmotionsTextureAsset]: new pc.Asset("tex_purus", "texture", {
                url: "textures/Emotions/T_Chibi_Emo_01.png",
            }),
            [SafeKeyAsset.CharIdleAnimationAsset]: new pc.Asset("anim_purus_idle", "animation", {
                url: "animations/Cat/Anim_Chibi@IdleA.glb",
            }),
            [SafeKeyAsset.CharDeathAnimationAsset]: new pc.Asset("anim_purus_death", "animation", {
                url: "animations/Cat/Anim_Chibi@DieA.glb",
            }),
            [SafeKeyAsset.CharRunAnimationAsset]: new pc.Asset("anim_purus_run", "animation", {
                url: "animations/Cat/Anim_Chibi@Run.glb",
            }),
            [SafeKeyAsset.CharJumpAnimationAsset]: new pc.Asset("anim_purus_jump", "animation", {
                url: "animations/Cat/Anim_Chibi@Jump.glb",
            }),
            [SafeKeyAsset.ObstacleAsset1]: new pc.Asset("obstacleModel1", "model", {
                url: "models/Map/obstacle_7_001.glb",
            }),
            [SafeKeyAsset.ObstacleAsset9]: new pc.Asset("obstacleModel9", "model", {
                url: "models/Map/obstacle_9_001.glb",
            }),
            [SafeKeyAsset.ObstacleAsset12]: new pc.Asset("obstacleModel12", "model", {
                url: "models/Map/obstacle_12_001.glb",
            }),
            [SafeKeyAsset.HammerObstacleAsset]: new pc.Asset("hammerObstacleAsset", "model", {
                url: "models/Map/obstacle_8_002.glb",
            }),
            [SafeKeyAsset.ItemAsset1]: new pc.Asset("starModel", "model", {
                url: "models/Map/coin_001.glb",
            }),
            [SafeKeyAsset.GroundAsset]: new pc.Asset("groundModel", "model", {
                url: "models/Map/platform_candy_002.glb",
            }),
            [SafeKeyAsset.GroundTextureAsset]: new pc.Asset("tex_ground", "texture", {
                url: "textures/Map/Textures3.png",
            }),
            [SafeKeyAsset.DecorationAsset1]: new pc.Asset("groundModel", "model", {
                url: "models/Map/ground_009.glb",
            }),
            [SafeKeyAsset.Font]: new pc.Asset("font", "font", {
                url: "./node_modules/lib/AmmoJS/Utils/courier.json",
            }),
            [SafeKeyAsset.IMGBackGroundPaper]: new pc.Asset("backgroundPaper", "texture", {
                url: "sprites/Shapes/Rectangle.png",
            }),
            [SafeKeyAsset.IMGBackGroundPause]: new pc.Asset("backgroundPause", "texture", {
                url: "sprites/Panel/PausePanel.png",
            }),
            [SafeKeyAsset.IMGBackGroundLose]: new pc.Asset("backgroundLose", "texture", {
                url: "sprites/Panel/LosePanel.png",
            }),
            [SafeKeyAsset.IMGBarTop]: new pc.Asset("imgBarTop", "texture", {
                url: "sprites/Shop/barTopBG.png",
            }),
            [SafeKeyAsset.IMGBackHomeIcon]: new pc.Asset("imgBackHomeIcon", "texture", {
                url: "sprites/Button/BackHomeIcon.png",
            }),
            [SafeKeyAsset.IMGClickToPlay]: new pc.Asset("imgClickToPlay", "texture", {
                url: "sprites/Button/CLICKTOPLAY.png",
            }),
            [SafeKeyAsset.IMGShopButton]: new pc.Asset("imgShopButton", "texture", {
                url: "sprites/Button/ShopButton.png",
            }),

            //#region Button
            [SafeKeyAsset.IMGButtonClose]: new pc.Asset("imgButtonClose", "texture", {
                url: "sprites/Icons/Error.png",
            }),
            [SafeKeyAsset.IMGButtonResume]: new pc.Asset("imgButtonResume", "texture", {
                url: "sprites/Button/ResumeButton.png",
            }),
            [SafeKeyAsset.IMGButtonBackHome]: new pc.Asset("imgButtonBackHome", "texture", {
                url: "sprites/Button/BackHomeButton.png",
            }),
            [SafeKeyAsset.IMGButtonSetting]: new pc.Asset("imgButtonResume", "texture", {
                url: "sprites/Button/Settings-256.png",
            }),
            [SafeKeyAsset.IMGGrayButton]: new pc.Asset("imgGrayButton", "texture", {
                url: "sprites/Button/GrayButton.png",
            }),
            [SafeKeyAsset.IMGBlueButton]: new pc.Asset("imgBlueButton", "texture", {
                url: "sprites/Button/BlueButton.png",
            }),
            [SafeKeyAsset.IMGRankButton]: new pc.Asset("imgRankButton", "texture", {
                url: "sprites/Button/rankButton.png",
            }),
            //#endregion

            [SafeKeyAsset.IMGCoinLabel]: new pc.Asset("imgCoinLabel", "texture", {
                url: "sprites/InGame/CoinTotalText.png",
            }),
            [SafeKeyAsset.IMGDistanceLabel]: new pc.Asset("imgDistanceLabel", "texture", {
                url: "sprites/InGame/DistanceText.png",
            }),
            [SafeKeyAsset.IMGTimeLabel]: new pc.Asset("imgTimeLabel", "texture", {
                url: "sprites/InGame/TimeText.png",
            }),

            //Sky
            [SafeKeyAsset.SkyboxAsset]: new pc.Asset("skyAsset", "cubemap", {
                url: "sprites/Sky/Sky.png",
            }),

            //#region particle
            [SafeKeyAsset.IMGRaindrop]: new pc.Asset("imgRaindrop", "texture", {
                url: "sprites/Particle/Raindrop.png",
            }, { srgb: true }),
            //#endregion

            //#region Decorate
            [SafeKeyAsset.AirBalloonAsset]: new pc.Asset("airBalloonAsset", "model", {
                url: "models/Decorate/air_balloon_001.glb",
            }),
            [SafeKeyAsset.IceCreamAsset]: new pc.Asset("iceCreamAsset", "model", {
                url: "models/Decorate/ice_cream_001.glb",
            }),
            [SafeKeyAsset.Lollipop24Asset]: new pc.Asset("lollipop24Asset", "model", {
                url: "models/Decorate/lollipop_024.glb",
            }),
            [SafeKeyAsset.Lollipop34Asset]: new pc.Asset("lollipop34Asset", "model", {
                url: "models/Decorate/lollipop_034.glb",
            }),
            [SafeKeyAsset.GrassGroundAsset]: new pc.Asset("grassGroundAsset", "model", {
                url: "models/Decorate/ground_011.glb",
            }),
            //#endregion

            //#region Sound
            [SafeKeyAsset.JumpSoundEffect]: new pc.Asset("jumpSoundEffect", "audio", {
                url: "sound/jumpSoundEF.mp3",
            }),
            [SafeKeyAsset.CoinSoundEffect]: new pc.Asset("coinSoundEffect", "audio", {
                url: "sound/coinSoundEF.mp3",
            }),
            [SafeKeyAsset.BackGroundMusic]: new pc.Asset("backGroundMusic", "audio", {
                url: "sound/MusicBG.mp3",
            }),
            [SafeKeyAsset.LoseGameSoundEffect]: new pc.Asset("loseGameSoundEffect", "audio", {
                url: "sound/LoseGameSoundEF.mp3",
            }),
            //#endregion

            [SafeKeyAsset.CloudAsset]: new pc.Asset("cloudAsset", "model", {
                url: "models/Map/candy_001.glb",
            }),

            //#region Shop Item Button UI
            [SafeKeyAsset.IMGItemShop1]: new pc.Asset("imgItemShop1", "texture", {
                url: "sprites/Shop/ShopItem/ShopItem1.png",
            }),
            [SafeKeyAsset.IMGItemShop2]: new pc.Asset("imgItemShop2", "texture", {
                url: "sprites/Shop/ShopItem/ShopItem2.png",
            }),
            [SafeKeyAsset.IMGItemShop3]: new pc.Asset("imgItemShop3", "texture", {
                url: "sprites/Shop/ShopItem/ShopItem3.png",
            }),
            [SafeKeyAsset.IMGItemShop4]: new pc.Asset("imgItemShop4", "texture", {
                url: "sprites/Shop/ShopItem/ShopItem4.png",
            }),
            [SafeKeyAsset.IMGItemShop5]: new pc.Asset("imgItemShop5", "texture", {
                url: "sprites/Shop/ShopItem/ShopItem5.png",
            }),
            [SafeKeyAsset.IMGItemShop6]: new pc.Asset("imgItemShop6", "texture", {
                url: "sprites/Shop/ShopItem/ShopItem6.png",
            }),
            [SafeKeyAsset.IMGItemShop7]: new pc.Asset("imgItemShop7", "texture", {
                url: "sprites/Shop/ShopItem/ShopItem7.png",
            }),
            [SafeKeyAsset.IMGItemShop8]: new pc.Asset("imgItemShop8", "texture", {
                url: "sprites/Shop/ShopItem/ShopItem8.png",
            }),
            //#endregion
        
            [SafeKeyAsset.IMGHandWhite]: new pc.Asset("imgHandWhite", "texture", {
                url: "sprites/Icons/Hand-White-256.png",
            }),

            // //tween
            // [SafeKeyAsset.TweenScript]: new pc.Asset("script", "script", {
            //     url: "./scr/lib/Tween/tween.js",
            // }),
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
