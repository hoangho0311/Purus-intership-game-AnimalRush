import * as pc from "playcanvas";
import { State } from "../StateMachine/State";
import { IdleState } from "../StateMachine/IdleState";
import { RunState } from "../StateMachine/RunState";
import { DeathState } from "../StateMachine/DeathState";
import { JumpState } from "../StateMachine/JumpState";
import { InputHandler } from "../Input/InputHandler ";
import { AssetManager } from "../Manager/AssetManager";
import { SafeKeyAsset } from "../Helper/SafeKeyAsset";
import { SoundManager } from "../Manager/SoundManager";
import { GameManager } from "../Manager/GameManager";

export class Character {
    app: pc.Application;
    entity: pc.Entity;
    currentState: State;
    states: { [key: string]: State };
    isGrounded: boolean;
    jumpCooldown: number;
    isPlayerDead: boolean;
    inputHandler: InputHandler;
    soundManager: SoundManager;
    gameManager: GameManager;
    assetManager: AssetManager;
    startX: number;

    constructor(app: pc.Application, assetManager: AssetManager, inputHandler: InputHandler) {
        this.app = app;
        this.inputHandler = inputHandler;
        this.entity = new pc.Entity("Character");
        this.isGrounded = true;
        this.isPlayerDead = false;
        this.jumpCooldown = 0;
        this.startX = inputHandler.startX;
        this.soundManager = SoundManager.getInstance(app);
        this.assetManager = assetManager;
        this.gameManager = GameManager.getInstance();

        this.entity.script = { characterInstance: this };
        
        const scale = 1.4;
        this.entity.setLocalScale(scale, scale, scale);
        this.entity.setPosition(0, 0, 0);

        const charModel = assetManager.getAsset(SafeKeyAsset.CharModelAsset);
        const charIdleAnimation = assetManager.getAsset(SafeKeyAsset.CharIdleAnimationAsset);
        const charRunAnimation = assetManager.getAsset(SafeKeyAsset.CharRunAnimationAsset);
        const charJumpAnimation = assetManager.getAsset(SafeKeyAsset.CharJumpAnimationAsset);
        const charDeathAnimation = assetManager.getAsset(SafeKeyAsset.CharDeathAnimationAsset);

        this.entity.addComponent("model", {
            type: "asset",
            asset: charModel,
        });

        this.entity.addComponent("animation", {
            assets: [
                charIdleAnimation,
                charRunAnimation,
                charJumpAnimation,
                charDeathAnimation,
            ],
        });

        this.entity.addComponent("rigidbody", {
            type: "dynamic",
            mass: 30,
        });

        this.entity.addComponent("collision", {
            type: "box",
            halfExtents: [0.5, 0.8, 0.5],
            linearOffset: new pc.Vec3(0, 1.4, 0),
        });

        this.entity.tags.add("player");

        this.applyMaterials(assetManager);
        this.entity.rigidbody!.angularFactor = new pc.Vec3(0, 0, 0);

        app.root.addChild(this.entity);

        this.states = {
            idle: new IdleState(this),
            run: new RunState(this),
            jump: new JumpState(this),
            death: new DeathState(this),
        };

        this.currentState = this.states.idle;
        this.currentState.enter();
    }

    showColliderBox() {
        const colliderBox = new pc.Entity("ColliderBox");

        colliderBox.addComponent("model", {
            type: "box",
        });

        colliderBox.setLocalScale(1, 1.6, 1);
        colliderBox.setLocalPosition(0, 0.7, 0);

        const material = new pc.StandardMaterial();
        material.diffuse = new pc.Color(1, 0, 0);
        material.opacity = 0.3;
        material.blendType = pc.BLEND_NORMAL;
        material.update();

        colliderBox.model!.meshInstances[0].material = material;

        this.entity.addChild(colliderBox);
    }

    applyMaterials(assetManager: AssetManager) {
        const charColorTexture = assetManager.getAsset(SafeKeyAsset.CharColorTextureAsset);
        const charEmotionsTexture = assetManager.getAsset(SafeKeyAsset.CharEmotionsTextureAsset);

        if (!charColorTexture || !charEmotionsTexture) {
            throw new Error("Missing required texture assets.");
        }

        const materialFromTexture = new pc.StandardMaterial();
        materialFromTexture.diffuseMap = charColorTexture.resource;
        materialFromTexture.update();

        const materialFromEmotions = new pc.StandardMaterial();
        materialFromEmotions.diffuseMap = charEmotionsTexture.resource;
        materialFromEmotions.blendType = pc.BLEND_NORMAL;
        materialFromEmotions.opacityMap = charEmotionsTexture.resource;
        materialFromEmotions.alphaTest = 0.5;
        materialFromEmotions.depthWrite = false;
        materialFromEmotions.update();

        const meshInstances = this.entity.model!.meshInstances;

        if (meshInstances.length >= 2) {
            meshInstances[0].material = materialFromTexture;
            meshInstances[1].material = materialFromEmotions;
        }
    }

    applySkinMaterial(newMaterial: pc.StandardMaterial) {
        const meshInstances = this.entity.model!.meshInstances;
        for (let i = 0; i < meshInstances.length; i++) {
            meshInstances[i].material = newMaterial;
        }
        console.log("Character material updated.");
    }

    update(dt: number) {
        this.currentState.update(dt);
    }

    playAnimation(animationAsset: pc.Asset, transitionTime: number, loop: boolean, speed: number) {
        if (this.entity.animation) {
            this.entity.animation.play(animationAsset.name, transitionTime);
            this.entity.animation.loop = loop;
            this.entity.animation.speed = speed;
        }
    }

    changeState(newState: string) {
        this.currentState.exit();
        this.currentState = this.states[newState];
        this.currentState.enter();
    }

    reset() {
        this.entity.setPosition(0,1,0);
        this.isPlayerDead = false;
        this.isGrounded = true;
        this.jumpCooldown = 0;

        this.changeState('run');
    }
}
