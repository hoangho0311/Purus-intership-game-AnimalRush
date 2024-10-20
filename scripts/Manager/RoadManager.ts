import * as pc from "playcanvas";
import { RoadPrefab } from "../Entities/RoadPrefab";

export class RoadManager {
  app: pc.Application;
  roadPool: pc.Entity[];
  maxRoads: number;
  roadLength: number;
  roadWidth: number;
  playerEntity: pc.Entity;
  roadSpeed: number;
  assets: any;
  roadPrefabManager: RoadPrefab;

  constructor(app: pc.Application, playerEntity: pc.Entity, maxRoads: number, roadWidth: number, roadLength: number, assets: any) {
    this.app = app;
    this.playerEntity = playerEntity;
    this.assets = assets;
    this.maxRoads = maxRoads;
    this.roadWidth = roadWidth;
    this.roadLength = roadLength;
    this.roadPool = [];
    this.roadSpeed = 10;

    this.roadPrefabManager = new RoadPrefab(this.roadWidth, this.roadLength);

    for (let i = 0; i < this.maxRoads; i++) {
      const road = this.createCustomRoad(i * this.roadLength);
      this.app.root.addChild(road);
      this.roadPool.push(road);
    }
  }

  createCustomRoad(zPos: number): pc.Entity {
    const obstacles = [
      { position: new pc.Vec3(-1, 1, 0), asset: this.assets },
      { position: new pc.Vec3(1, 1, 0), asset: this.assets }
    ];

    const items = [
      { position: new pc.Vec3(0, 1, 0), asset: this.assets },
      { position: new pc.Vec3(-1, 1, 0), asset: this.assets }
    ];

    const road = this.roadPrefabManager.createCustomRoad(obstacles, items);
    road.setPosition(0, 0, zPos);
    return road;
  }

  update(dt: number) {
    this.roadPool.forEach((road) => {
      const currentPos = road.getPosition();
      currentPos.z -= this.roadSpeed * dt;
      road.rigidbody!.teleport(currentPos, road.getRotation());
    });

    if (this.roadPool.length > 0 && this.roadPool[0].getPosition().z < this.playerEntity.getPosition().z - this.roadLength) {
      this.reSpawnRoad();
    }
  }

  reSpawnRoad() {
    const oldRoad = this.roadPool.shift();
    const lastRoad = this.roadPool[this.roadPool.length - 1];
    const lastRoadPos = lastRoad.getPosition();

    oldRoad.setPosition(0, 0, lastRoadPos.z + this.roadLength);

    this.roadPool.push(oldRoad);
  }
}
