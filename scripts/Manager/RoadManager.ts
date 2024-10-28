import * as pc from "playcanvas";
import { RoadPrefab } from "../Entities/RoadPrefab";
import { GameManager } from "./GameManager";
import { AssetManager } from "./AssetManager";

export class RoadManager {
    app: pc.Application;
    roadPool: pc.Entity[] = [];
    maxRoads: number;
    roadLength: number;
    roadWidth: number;
    playerEntity: any;
    roadSpeed: number = 40;
    speedIncrement: number = 0.1;
    maxRoadSpeed: number = 200;
    roadPrefabManager: RoadPrefab;
    gameManager: GameManager;
    assetManager: AssetManager;
    respawnCount: number = 0;
    noObstacleRespawnThreshold: number = 1;
    
    roadConfigs: Array<{
        obstacles: { position: pc.Vec3, assetKey: string, type: string, scale: pc.Vec3, collisionConfig: any }[],
        items: { position: pc.Vec3, assetKey: string }[],
        decorations: { position: pc.Vec3, assetKey: string, scale: pc.Vec3 }[]
    }>;

    constructor(app: pc.Application, playerEntity: any, maxRoads: number, roadWidth: number, roadLength: number) {
        this.app = app;
        this.playerEntity = playerEntity;
        this.maxRoads = maxRoads;
        this.roadWidth = roadWidth;
        this.roadLength = roadLength;

        this.gameManager = GameManager.getInstance();
        this.assetManager = AssetManager.getInstance();
        this.roadPrefabManager = new RoadPrefab(this.app, this.roadWidth, this.roadLength);

        this.roadConfigs = [
            {
                obstacles: [
                    {
                        position: new pc.Vec3(0, 0, 0),
                        assetKey: "obstacleAsset1",
                        type: "Barrier",
                        scale: new pc.Vec3(1, 1, 1),
                        collisionConfig: {
                            type: "box",
                            halfExtents: new pc.Vec3(1, 2, 1),
                            linearOffset: new pc.Vec3(0, 2, 0)
                        }
                    }
                ],
                items: [
                    { position: new pc.Vec3(-3, 1, 0), assetKey: "itemAsset1" }
                ],
                decorations: [
                    { position: new pc.Vec3(-15, -3, 0), assetKey: "grassGroundAsset", scale: new pc.Vec3(1, 1, 4), },
                    { position: new pc.Vec3(15, -3, 0), assetKey: "grassGroundAsset", scale: new pc.Vec3(1, 1, 4), },
                    { position: new pc.Vec3(-15, 3, 0), assetKey: "airBalloonAsset", scale: new pc.Vec3(1, 1, 1), }
                ]
            },
            {
                obstacles: [
                    {
                        position: new pc.Vec3(-5, 15, 0),
                        assetKey: "hammerObstacleAsset",
                        type: "Barrier",
                        scale: new pc.Vec3(3, 3, 3),
                        collisionConfig: {
                            type: "box",
                            halfExtents: new pc.Vec3(1, 2, 1),
                            linearOffset: new pc.Vec3(0, 2, 0)
                        }
                    }
                ],
                items: [
                ],
                decorations: [
                    { position: new pc.Vec3(-15, -3, 0), assetKey: "grassGroundAsset", scale: new pc.Vec3(1, 1, 4), },
                    { position: new pc.Vec3(15, -3, 0), assetKey: "grassGroundAsset", scale: new pc.Vec3(1, 1, 4), },
                    { position: new pc.Vec3(-15, 3, 0), assetKey: "airBalloonAsset", scale: new pc.Vec3(1, 1, 1), }
                ]
            },
            {
                obstacles: [
                    {
                        position: new pc.Vec3(-3, 0, 0),
                        assetKey: "obstacleAsset9",
                        type: "Scythe",
                        scale: new pc.Vec3(2, 2, 2),
                        collisionConfig: {
                            type: "box",
                            halfExtents: new pc.Vec3(0.4, 1, 0.4),
                            linearOffset: new pc.Vec3(0, 1, 0)
                        }
                    }
                ],
                items: [
                    { position: new pc.Vec3(0, 1, 0), assetKey: "itemAsset1" }
                ],
                decorations: [
                    { position: new pc.Vec3(-15, -3, 0), assetKey: "grassGroundAsset", scale: new pc.Vec3(1, 1, 4), },
                    { position: new pc.Vec3(15, -3, 0), assetKey: "grassGroundAsset", scale: new pc.Vec3(1, 1, 4), },
                    { position: new pc.Vec3(10, 0, 0), assetKey: "lollipop34Asset", scale: new pc.Vec3(1.5, 1.5, 1.5), },
                    { position: new pc.Vec3(-10, 0, 0), assetKey: "iceCreamAsset", scale: new pc.Vec3(1, 1, 1), },

                ]
            },
            {
                obstacles: [
                    {
                        position: new pc.Vec3(0, 0, 0),
                        assetKey: "obstacleAsset12",
                        type: "SawBlade",
                        scale: new pc.Vec3(1, 1, 1),
                        collisionConfig: {
                            type: "box",
                            halfExtents: new pc.Vec3(6, 0.6, 0.5),
                            linearOffset: new pc.Vec3(0, 1, 0)
                        }
                    }
                ],
                items: [
                ],
                decorations: [
                    { position: new pc.Vec3(-15, -3, 0), assetKey: "grassGroundAsset", scale: new pc.Vec3(1, 1, 4), },
                    { position: new pc.Vec3(15, -3, 0), assetKey: "grassGroundAsset", scale: new pc.Vec3(1, 1, 4), },
                    { position: new pc.Vec3(-10, 0, 0), assetKey: "lollipop24Asset", scale: new pc.Vec3(1, 1, 1),},
                    { position: new pc.Vec3(10, 0, 0), assetKey: "lollipop34Asset", scale: new pc.Vec3(1.5, 1.5, 1.5), },
                
                ]
            },
        ];

        this.initializeRoads();
    }

    initializeRoads() {
        for (let i = 0; i < this.maxRoads; i++) {
            const road = this.createEmptyRoad(i * this.roadLength);
            this.app.root.addChild(road);
            this.roadPool.push(road);
        }
    }

    createEmptyRoad(zPos: number): pc.Entity {
        const road = this.roadPrefabManager.createCustomRoad([], [], [
            { position: new pc.Vec3(-15, -3, 0), assetKey: "grassGroundAsset", scale: new pc.Vec3(1, 1, 4), },
            { position: new pc.Vec3(15, -3, 0), assetKey: "grassGroundAsset", scale: new pc.Vec3(1, 1, 4), },
        ]);
        road.setPosition(0, 0, zPos);
        return road;
    }

    createRandomRoad(zPos: number): pc.Entity {
        const randomIndex = Math.floor(Math.random() * this.roadConfigs.length);
        const selectedConfig = this.roadConfigs[randomIndex];
        const road = this.roadPrefabManager.createCustomRoad(
            selectedConfig.obstacles,
            selectedConfig.items,
            selectedConfig.decorations,
        );

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

        this.checkAndRespawnRoads();
    }

    checkAndRespawnRoads() {
        if (this.roadPool.length > 0 && this.roadPool[0].getPosition().z < this.playerEntity.entity.getPosition().z - this.roadLength) {
            this.reSpawnRoad();
        }
    }

    reSpawnRoad() {
        const oldRoad = this.roadPool.shift();
        const lastRoad = this.roadPool[this.roadPool.length - 1];

        if (lastRoad && oldRoad) {
            const lastRoadPos = lastRoad.getPosition();
            const newRoad = this.respawnCount < this.noObstacleRespawnThreshold
                ? this.createEmptyRoad(lastRoadPos.z + this.roadLength)
                : this.createRandomRoad(lastRoadPos.z + this.roadLength);

            this.app.root.addChild(newRoad);
            this.roadPool.push(newRoad);
            this.respawnCount++;
        }
    }

    resetRoads() {
        this.roadPool.forEach(road => {
            this.app.root.removeChild(road);
            road.destroy();
        });
    
        this.roadPool = [];
    
        for (let i = 0; i < this.maxRoads; i++) {
            const road = this.createEmptyRoad(i * this.roadLength);
            this.app.root.addChild(road);
            this.roadPool.push(road);
        }
    
        this.roadSpeed = 40;
    }
}
