import * as pc from "playcanvas";
import { AssetManager } from "../Manager/AssetManager";
import { SafeKeyAsset } from "../Helper/SafeKeyAsset";

export class SoundManager extends pc.Entity {
    private static instance: SoundManager;
    private app: pc.Application;
    private assetManager: AssetManager;

    constructor(app: pc.Application) {
        super();
        this.app = app;
        this.assetManager = AssetManager.getInstance();
        this.addComponent("sound");
        this.app.root.addChild(this);
    }

    public static getInstance(app?: pc.Application): SoundManager {
        if (!SoundManager.instance && app) {
            SoundManager.instance = new SoundManager(app);
        }
        return SoundManager.instance;
    }

    public playSoundByKey(assetKey: string, loop: boolean = false, volume: number = 1, pitch: number = 1): void {
        const soundAsset = this.assetManager.getAsset(assetKey);
        if (soundAsset && soundAsset.resource) {
            if (!this.sound.slot(assetKey)) { 
                this.sound.addSlot(assetKey, {
                    asset: soundAsset.id,
                    loop,
                    volume,
                    pitch,
                    autoPlay: true,
                });
            } else {
                this.sound.slot(assetKey)!.play();
            }
        }
    }

    public stopSoundByKey(assetKey: string): void {
        if (this.sound.slot(assetKey)) {
            this.sound.slot(assetKey)!.stop();
        }
    }
}

