import * as pc from "playcanvas";
import { AssetManager } from "./AssetManager";
import { SafeKeyAsset } from "../Helper/SafeKeyAsset";

export class SoundManager extends pc.Entity {
    private static instance: SoundManager;
    private app: pc.Application;
    private assetManager: AssetManager;
    
    isSoundMuted: boolean = false;
    isMusicMuted: boolean = false;

    constructor(app: pc.Application) {
        super();
        this.app = app;
        this.assetManager = AssetManager.getInstance();
        this.addComponent("sound");
        this.app.root.addChild(this);

        this.setupSoundSlots();
    }

    public static getInstance(app?: pc.Application): SoundManager {
        if (!SoundManager.instance && app) {
            SoundManager.instance = new SoundManager(app);
        }
        return SoundManager.instance;
    }

    private setupSoundSlots() {
        this.sound!.addSlot("backgroundMusic", {
            asset: this.assetManager.getAsset(SafeKeyAsset.BackGroundMusic)?.id,
            loop: true,
            volume: 1,
            autoPlay: true
        });

        this.sound!.addSlot("jump", {
            asset: this.assetManager.getAsset(SafeKeyAsset.JumpSoundEffect)?.id,
            loop: false,
            volume: 1,
        });

        this.sound!.addSlot("earn", {
            asset: this.assetManager.getAsset(SafeKeyAsset.CoinSoundEffect)?.id,
            loop: false,
            volume: 1,
        });

        this.sound!.addSlot("lose", {
            asset: this.assetManager.getAsset(SafeKeyAsset.LoseGameSoundEffect)?.id,
            loop: false,
            volume: 1,
        });
    }

    public playSoundEffect(key: string): void {
        if (this.isSoundMuted) return;
        
        const soundSlot = this.sound!.slot(key);
        if (soundSlot) {
            soundSlot.play();
        }
    }

    public playMusic(): void {
        if (this.isMusicMuted) return;
        
        const musicSlot = this.sound!.slot("backgroundMusic");
        if (musicSlot) {
            musicSlot.play();
        }
    }

    public stopMusic(): void {
        const musicSlot = this.sound!.slot("backgroundMusic");
        if (musicSlot) {
            musicSlot.stop();
        }
    }

    public toggleSoundEffects(): void {
        this.isSoundMuted = !this.isSoundMuted;
        Object.keys(this.sound!.slots).forEach(slotName => {
            if (slotName !== "backgroundMusic") {
                this.sound!.slot(slotName)!.volume = this.isSoundMuted ? 0 : 1;
            }
        });
    }

    public toggleMusic(): void {
        this.isMusicMuted = !this.isMusicMuted;
        const musicSlot = this.sound!.slot("backgroundMusic");
        if (musicSlot) {
            musicSlot.volume = this.isMusicMuted ? 0 : 1;
        }
    }
}
