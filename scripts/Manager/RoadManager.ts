import * as pc from "playcanvas";
import { RoadPrefab } from "../Entities/RoadPrefab";
import { GameManager } from "./GameManager";

export class RoadManager {
    app: pc.Application;
    roadPool: pc.Entity[];
    maxRoads: number;
    roadLength: number;
    roadWidth: number;
    playerEntity: any;
    roadSpeed: number;
    speedIncrement: number;
    maxRoadSpeed: number;
    assets: any;
    roadPrefabManager: RoadPrefab;
    gameManager: GameManager

    roadConfigs: Array<{
        obstacles: { position: pc.Vec3, asset: pc.Asset, type: string, scale: pc.Vec3, collisionConfig: any }[],
        items: { position: pc.Vec3, asset: pc.Asset }[],
        decorations: { position: pc.Vec3, asset: pc.Asset }[]
    }>;

    constructor(app: pc.Application, playerEntity: any, maxRoads: number, roadWidth: number, roadLength: number, assets: any) {
        this.app = app;
        this.playerEntity = playerEntity;
        this.assets = assets;
        this.maxRoads = maxRoads;
        this.roadWidth = roadWidth;
        this.roadLength = roadLength;
        this.roadPool = [];
        this.speedIncrement = 0.1;
        this.maxRoadSpeed = 40;
        this.roadSpeed = 10;

        this.gameManager = GameManager.getInstance();
        this.roadPrefabManager = new RoadPrefab(this.app, this.roadWidth, this.roadLength);

        this.roadConfigs = [
            {
                obstacles: [
                    { position: new pc.Vec3(0, 0, 0), asset: this.assets.obstacleAsset1, type: "Barrier", scale: new pc.Vec3(1/this.roadWidth, 1, 1/this.roadLength), 
                      collisionConfig: { type: "box", halfExtents: new pc.Vec3(1, 2, 1), linearOffset:  new pc.Vec3(0, 2, 0)} }
                ],
                items: [
                    { position: new pc.Vec3(-3, 1, 0), asset: this.assets.itemAsset1 }
                ],
                decorations: [
                    // { position: new pc.Vec3(9, 1, 0), asset: this.assets.decorationAsset1 },
                    // { position: new pc.Vec3(-9, 1, 0), asset: this.assets.decorationAsset1 }
                ],
            },
            {
                obstacles: [
                    { position: new pc.Vec3(-3, 0, 0), asset: this.assets.obstacleAsset9, type: "Scythe", scale: new pc.Vec3(2/this.roadWidth, 2, 2/this.roadLength), 
                      collisionConfig: { type: "box", halfExtents: new pc.Vec3(0.4, 1, 0.4), linearOffset:  new pc.Vec3(0, 1, 0)} }
                ],
                items: [
                    { position: new pc.Vec3(0, 1, 0), asset: this.assets.itemAsset1 }
                ],
                decorations: [],
            },
            // {
            //     obstacles: [
            //         { position: new pc.Vec3(0, 0, 0), asset: this.assets.obstacleAsset1, type: "Scythe", scale: new pc.Vec3(1/this.roadWidth, 1, 1/this.roadLength), 
            //           collisionConfig: { type: "box", halfExtents: new pc.Vec3(0.5, 2, 0.5) } }
            //     ],
            //     items: [
            //         { position: new pc.Vec3(-3, 1, 0), asset: this.assets.itemAsset1 },
            //         { position: new pc.Vec3(3, 1, 0), asset: this.assets.itemAsset1 }
            //     ],
            //     decorations: [],
            // }
        ];

        for (let i = 0; i < this.maxRoads; i++) {
            const road = this.createRandomRoad(i * this.roadLength);
            this.app.root.addChild(road);
            this.roadPool.push(road);
        }
    }

    createRandomRoad(zPos: number): pc.Entity {
        const randomIndex = Math.floor(Math.random() * this.roadConfigs.length);
        const selectedConfig = this.roadConfigs[randomIndex];
        const road = this.roadPrefabManager.createCustomRoad(selectedConfig.obstacles, selectedConfig.items, selectedConfig.decorations, this.assets);

        road.children.forEach((child) => {
            if (child.name === "Obstacle" && child.collision) {
                child.collision.on('collisionstart', (result) => {
                    if (result.other.tags.has('player')) {
                        if (!this.playerEntity.isPlayerDead) {
                            this.gameManager.endGame();
                            this.playerEntity.changeState('death');
                        }
                    }
                });
            }
        });

        road.setPosition(0, 0, zPos);
        return road;
    }

    update(dt: number) {
        if (this.playerEntity.isPlayerDead || this.gameManager.isOver()) return;

        this.roadSpeed = Math.min(this.roadSpeed + this.speedIncrement * dt, this.maxRoadSpeed);
        this.gameManager.updateDistance(this.roadSpeed * dt);

        this.roadPool.forEach((road) => {
            const currentPos = road.getPosition();
            currentPos.z -= this.roadSpeed * dt;
            road.rigidbody!.teleport(currentPos, road.getRotation());

            road.children.forEach((child) => {
              if (child.rigidbody) {
                const childPos = child.getPosition();
                child.rigidbody.teleport(childPos);
              }
            });
        });

        

        if (this.roadPool.length > 0 && this.roadPool[0].getPosition().z < this.playerEntity.entity.getPosition().z - this.roadLength) {
            this.reSpawnRoad();
        }
    }

    reSpawnRoad() {
        const oldRoad = this.roadPool.shift();
        const lastRoad = this.roadPool[this.roadPool.length - 1];

        if (lastRoad && oldRoad) {
            const lastRoadPos = lastRoad.getPosition();
            const newRoad = this.createRandomRoad(lastRoadPos.z + this.roadLength);
            this.app.root.addChild(newRoad);
            this.roadPool.push(newRoad);
        }
    }
}
