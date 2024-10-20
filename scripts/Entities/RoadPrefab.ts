import * as pc from "playcanvas";

export class RoadPrefab {
  roadWidth: number;
  roadLength: number;

  constructor(roadWidth: number, roadLength: number) {
    this.roadWidth = roadWidth;
    this.roadLength = roadLength;
  }

  createRoad(): pc.Entity {
    const road = new pc.Entity("Road");

    road.addComponent("model", {
      type: "box"
    });

    road.setLocalScale(this.roadWidth, 1, this.roadLength);

    road.addComponent("rigidbody", {
      type: "static",
      restitution: 0.5,
    });

    road.addComponent("collision", {
      type: "box",
      halfExtents: [this.roadWidth / 2, 0.5, this.roadLength / 2],
    });
    road.tags.add("ground");
    return road;
  }

  addObstacle(road: pc.Entity, position: pc.Vec3, asset: pc.Asset): pc.Entity {
    const obstacle = new pc.Entity("Obstacle");

    obstacle.addComponent("model", {
      type: "asset",
      asset: asset.obstacleAsset1,
    });

    const scale = 0.5;
    obstacle.setLocalScale(scale/ this.roadWidth, scale, scale/this.roadLength);

    obstacle.addComponent("rigidbody", {
      type: "static",
      restitution: 0.5,
    });
  
    obstacle.addComponent("collision", {
      type: "box",
      halfExtents: new pc.Vec3(0.5, 2, 0.3)
    });

    obstacle.setLocalPosition(position);
    road.addChild(obstacle);
    obstacle.collision!.on('collisionstart', function (result) {
      if (result.other.tags.has('player')) {
        console.log('Player hit an obstacle!');
      }
    });
    return obstacle;
  }
  

  addItem(road: pc.Entity, position: pc.Vec3, asset: pc.Asset): pc.Entity {
    const item = new pc.Entity("Item");

    item.addComponent("model", {
      type: "asset",
      asset: asset.itemAsset1,
    });

    const scale = 0.3;
    item.setLocalScale(scale/ this.roadWidth, scale, scale/this.roadLength);

    item.addComponent("collision", {
      type: "box",
      halfExtents: new pc.Vec3(0.4, 0.2, 0.3),
      trigger: true,
    });

    item.setLocalPosition(position);
    road.addChild(item);
    item.collision!.on('triggerenter', function (result) {
      if (result.tags.has('player')) {
          console.log('Item collected by player!');
          item.destroy();
      }
    });

    return item;
  }

  createCustomRoad(obstacles: { position: pc.Vec3, asset: pc.Asset }[], 
    items: { position: pc.Vec3, asset: pc.Asset }[]): pc.Entity {
    const road = this.createRoad();

    obstacles.forEach(obstacle => {
      this.addObstacle(road, obstacle.position, obstacle.asset);
    });

    items.forEach(item => {
      this.addItem(road, item.position, item.asset);
    });

    return road;
  }
}
