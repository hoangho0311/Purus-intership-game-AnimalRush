import * as pc from "playcanvas";
import { GameManager } from "../Manager/GameManager";

export class RoadPrefab {
    roadWidth: number;
    roadLength: number;

    constructor(roadWidth: number, roadLength: number) {
        this.roadWidth = roadWidth;
        this.roadLength = roadLength;
    }

    createRoad(Asset: pc.Asset): pc.Entity {
        const road = new pc.Entity("Road");

        road.addComponent("model", {
            type: "asset",
            asset: Asset.groundAsset,
        });

        const material = road.model?.meshInstances[0].material as pc.StandardMaterial;
        material.diffuseMap = Asset.groundTextureAsset.resource;

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

    addDecoration(road: pc.Entity, position: pc.Vec3, asset: pc.Asset): pc.Entity {
        const decoration = new pc.Entity("Decoration");

        decoration.addComponent("model", {
            type: "asset",
            asset: asset,
        });

        const scale = 0.3;
        decoration.setLocalScale(scale / this.roadWidth, scale, scale / this.roadLength);

        decoration.setLocalPosition(position);

        road.addChild(decoration);

        return decoration;
    }

    addObstacle(road: pc.Entity, position: pc.Vec3, asset: pc.Asset): pc.Entity {
        const obstacle = new pc.Entity("Obstacle");

        obstacle.addComponent("model", {
            type: "asset",
            asset: asset,
        });

        const scale = 1;
        obstacle.setLocalScale(scale / this.roadWidth, scale, scale / this.roadLength);

        obstacle.addComponent("rigidbody", {
            type: "static",
            restitution: 0.5,
        });
      
        obstacle.addComponent("collision", {
            type: "box",
            halfExtents: new pc.Vec3(1, 2, 1),
        });

        obstacle.setLocalPosition(position);
        road.addChild(obstacle);

        return obstacle;
    }

    addItem(road: pc.Entity, position: pc.Vec3, asset: pc.Asset): pc.Entity {
        const item = new pc.Entity("Item");
        const gameManager = GameManager.getInstance();

        item.addComponent("model", {
            type: "asset",
            asset: asset,
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
        obstacles: { position: pc.Vec3, asset: pc.Asset }[],
        items: { position: pc.Vec3, asset: pc.Asset }[],
        decorations: { position: pc.Vec3, asset: pc.Asset}[],
        Asset: pc.Asset,
    ): pc.Entity {
        const road = this.createRoad(Asset);

        obstacles.forEach(obstacle => {
            this.addObstacle(road, obstacle.position, obstacle.asset);
        });

        items.forEach(item => {
            this.addItem(road, item.position, item.asset);
        });

        decorations.forEach(decoration => {
            this.addDecoration(road, decoration.position, decoration.asset);
        });

        return road;
    }
}
