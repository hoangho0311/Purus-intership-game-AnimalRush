import * as pc from "playcanvas";

import { State } from "../StateMachine/State";
import { IdleState } from "../StateMachine/IdleState";
import { RunState } from "../StateMachine/RunState";
import { DeathState } from "../StateMachine/DeathState";
import { JumpState } from "../StateMachine/JumpState";
import { InputHandler } from "../Input/InputHandler ";
import { GameManager } from "../Manager/GameManager";

export class Character {
    app: pc.Application;
    entity: pc.Entity;
    assets: any;
    currentState: State;
    states: { [key: string]: State };
    isGrounded: boolean;
    isJumpping: boolean;
    jumpCooldown: number;
    isPlayerDead: boolean;
    inputHandler: InputHandler;
    startX: number;
    gameManager: GameManager
    
    constructor(app: pc.Application, assets: any, inputHandler: InputHandler) {
        this.app = app;
        this.assets = assets;
        this.inputHandler = inputHandler;
        this.entity = new pc.Entity("Character");
        this.isGrounded = true;
        this.isJumpping = false;
        this.isPlayerDead = false;
        this.jumpCooldown = 0;
        this.startX = inputHandler.startX;
        this.gameManager = GameManager.getInstance();
        
        this.startX = 0;
        const scale = 1.4;
        this.entity.setLocalScale(scale, scale, scale);
        this.entity.setPosition(0, 0, -5);

        this.entity.addComponent("model", {
            type: "asset",
            asset: assets.charModelAsset,
        });

        this.entity.addComponent("animation", {
            assets: [
              assets.charIdleAnimationAsset,
              assets.charRunAnimationAsset,
              assets.charJumpAnimationAsset,
              assets.charDeathAnimationAsset,
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
        
        this.applyMaterials();
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
            type: "box"
        });
    
        colliderBox.setLocalScale(1, 1.6, 1); // Gấp đôi halfExtents của collider: [1, 2, 1.5]
    
        colliderBox.setLocalPosition(0, 0.7, 0);
    
        const material = new pc.StandardMaterial();
        material.diffuse = new pc.Color(1, 0, 0); // Màu đỏ để dễ nhận biết
        material.opacity = 0.3;
        material.blendType = pc.BLEND_NORMAL;
        material.update();
    
        colliderBox.model!.meshInstances[0].material = material;
    
        this.entity.addChild(colliderBox);
    }

    applyMaterials() {
        const materialFromTexture = new pc.StandardMaterial();
        materialFromTexture.diffuseMap = this.assets.charColorTextureAsset.resource;
        materialFromTexture.update();
    
        const materialFromEmotions = new pc.StandardMaterial();
        materialFromEmotions.diffuseMap = this.assets.charEmotionsTextureAsset.resource;
        materialFromEmotions.blendType = pc.BLEND_NORMAL;  // Kích hoạt alpha blending
        materialFromEmotions.opacityMap = this.assets.charEmotionsTextureAsset.resource;
        materialFromEmotions.alphaTest = 0.5;
        
        materialFromEmotions.depthWrite = false;
        materialFromEmotions.update();
    
        const meshInstances = this.entity.model!.meshInstances;
        
        if (meshInstances.length >= 2) {
            meshInstances[0].material = materialFromTexture; 
            meshInstances[1].material = materialFromEmotions; 
        }
    }

    update(dt: number) {
        // console.log(this.isPlayerDead)
        // this.startX = this.inputHandler.startX;
        this.currentState.update(dt);
    }

    playAnimation(animationAsset: any, transitionTime: number, loop: boolean, speed: number) {
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
}
