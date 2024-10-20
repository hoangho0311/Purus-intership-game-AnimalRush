import * as pc from "playcanvas";
import { RoadPrefab } from "../Entities/RoadPrefab";
import { Character } from "../Entities/Character";

export class RoadManager {
  app: pc.Application;
  roadPool: pc.Entity[];
  maxRoads: number;
  roadLength: number;
  roadWidth: number;
  playerEntity: any;
  roadSpeed: number;
  assets: any;
  roadPrefabManager: RoadPrefab;
  isPlayerStopped: boolean;

  roadConfigs: Array<{ obstacles: { position: pc.Vec3, asset: pc.Asset }[], items: { position: pc.Vec3, asset: pc.Asset }[] }>;

  constructor(app: pc.Application, playerEntity: any, maxRoads: number, roadWidth: number, roadLength: number, assets: any) {
    this.app = app;
    this.playerEntity = playerEntity;
    this.assets = assets;
    this.maxRoads = maxRoads;
    this.roadWidth = roadWidth;
    this.roadLength = roadLength;
    this.roadPool = [];
    this.roadSpeed = 10;
    this.isPlayerStopped = false;

    this.roadPrefabManager = new RoadPrefab(this.roadWidth, this.roadLength);

    this.roadConfigs = [
      {
        obstacles: [
          { position: new pc.Vec3(0.4, 0, 0), asset: this.assets }
        ],
        items: [
          { position: new pc.Vec3(0, 1, 0), asset: this.assets }
        ]
      },
      {
        obstacles: [
          { position: new pc.Vec3(-0.5, 0, 0), asset: this.assets }
        ],
        items: [
          { position: new pc.Vec3(0, 1, 0), asset: this.assets }
        ]
      },
      {
        obstacles: [
          { position: new pc.Vec3(0, 0, 0), asset: this.assets },
        ],
        items: [
          { position: new pc.Vec3(-0.5, 1, 0), asset: this.assets },
          { position: new pc.Vec3(0.5, 1, 0), asset: this.assets }
        ]
      }
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
    const road = this.roadPrefabManager.createCustomRoad(selectedConfig.obstacles, selectedConfig.items);
  
    road.children.forEach((child) => {
      if (child.name === "Obstacle" && child.collision) {
        child.collision.on('collisionstart', (result) => {
          if (result.other && result.other.tags && result.other.tags.has('player')) {
            this.isPlayerStopped = true;
            if (!this.playerEntity.isPlayerDead) {
              this.playerEntity.changeState('death');
            }
          }
        });
  
        child.collision.on('collisionend', () => {
          this.isPlayerStopped = false;
        });
      }
    });
  
    road.setPosition(0, 0, zPos);
    return road;
  }
  

  update(dt: number) {
    if (this.isPlayerStopped || this.playerEntity.isPlayerDead) return;
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
