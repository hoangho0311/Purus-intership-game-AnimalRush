import * as pc from "playcanvas";
import { GameManager } from "../Manager/GameManager";
import { Obstacle } from "../Entities/Obstacle";
import { SawBlade } from "../Entities/Obstacles/SawBlade";
import { Scythe } from "../Entities/Obstacles/Scythe";
import { Barrier } from "../Entities/Obstacles/Barrier";
import { AssetManager } from "../Manager/AssetManager";
import { SafeKeyAsset } from "../Helper/SafeKeyAsset";

export class RoadPrefab {
    app: pc.Application;
    roadWidth: number;
    roadLength: number;
    assetManager: AssetManager;

    constructor(app: pc.Application, roadWidth: number, roadLength: number) {
        this.app = app;
        this.roadWidth = roadWidth;
        this.roadLength = roadLength;
        this.assetManager = AssetManager.getInstance();
    }

    createRoad(): pc.Entity {
        const road = new pc.Entity("Road");

        const groundAsset = this.assetManager.getAsset(SafeKeyAsset.GroundAsset) as pc.Asset;
        const groundTexture = this.assetManager.getAsset(SafeKeyAsset.GroundTextureAsset) as pc.Asset;

        road.addComponent("model", {
            type: "asset",
            asset: groundAsset,
        });

        const material = road.model?.meshInstances[0].material as pc.StandardMaterial;
        material.diffuseMap = groundTexture.resource;
        this.assetManager.addMaterial(material);

        road.addComponent("rigidbody", {
            type: "static",
            restitution: 0.5,
        });

        const scale = 1;
        road.setLocalScale(this.roadWidth, scale, this.roadLength);

        road.addComponent("collision", {
            type: "box",
            halfExtents: new pc.Vec3(this.roadWidth * 6, 1, this.roadLength),
        });

        road.tags.add("ground");
        return road;
    }

    addDecoration(road: pc.Entity, position: pc.Vec3, assetKey: string): pc.Entity {
        const decorationAsset = this.assetManager.getAsset(assetKey) as pc.Asset;
        const decoration = new pc.Entity("Decoration");

        decoration.addComponent("model", {
            type: "asset",
            asset: decorationAsset,
        });

        const scale = 0.3;
        decoration.setLocalScale(scale / this.roadWidth, scale, scale / this.roadLength);

        decoration.setLocalPosition(position);

        road.addChild(decoration);

        return decoration;
    }

    createObstacle(road: pc.Entity, config: any): Obstacle {
        const { type, position, assetKey, scale, collisionConfig } = config;
        const obstacleAsset = this.assetManager.getAsset(assetKey) as pc.Asset;

        let obstacle: Obstacle;
        switch (type) {
            case "SawBlade":
                obstacle = new SawBlade(
                    this.app,
                    obstacleAsset,
                    position,
                    scale,
                    collisionConfig,
                    5
                );
                break;
            case "Scythe":
                obstacle = new Scythe(
                    this.app,
                    obstacleAsset,
                    position,
                    scale,
                    collisionConfig,
                    5
                );
                break;
            case "Barrier":
                obstacle = new Barrier(
                    this.app,
                    obstacleAsset,
                    position,
                    scale,
                    collisionConfig
                );
                break;
            default:
                obstacle = new Obstacle(this.app, obstacleAsset, position, scale, collisionConfig);
        }

        road.addChild(obstacle.entity);
        return obstacle;
    }

    addItem(road: pc.Entity, position: pc.Vec3, assetKey: string): pc.Entity {
        const itemAsset = this.assetManager.getAsset(assetKey) as pc.Asset;
        const item = new pc.Entity("Item");
        const gameManager = GameManager.getInstance();

        item.addComponent("model", {
            type: "asset",
            asset: itemAsset,
        });

        const scale = 1;
        item.setLocalScale(scale / this.roadWidth, scale, scale / this.roadLength);

        item.addComponent("collision", {
            type: "box",
            halfExtents: new pc.Vec3(0.4, 0.2, 0.3),
            trigger: true,
        });

        item.setLocalPosition(position);
        road.addChild(item);

        item.collision!.on('triggerenter', function (result) {
            if (result.tags.has('player')) {
                gameManager.addScore(1);
                item.destroy();
            }
        });

        return item;
    }

    createCustomRoad(
        obstacles: any[],
        items: { position: pc.Vec3, assetKey: string }[],
        decorations: { position: pc.Vec3, assetKey: string }[]
    ): pc.Entity {
        const road = this.createRoad();

        obstacles.forEach(config => {
            this.createObstacle(road, config);
        });

        items.forEach(item => {
            this.addItem(road, item.position, item.assetKey);
        });

        decorations.forEach(decoration => {
            this.addDecoration(road, decoration.position, decoration.assetKey);
        });

        return road;
    }
}
