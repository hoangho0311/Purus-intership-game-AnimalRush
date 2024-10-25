import * as pc from "playcanvas";
import { RoadManager } from "./RoadManager";
import { Character } from "../Entities/Character";
import { TimeManager } from "./TimeManager";
import { ScoreManager } from "./ScoreManager";
import { DistanceManager } from "./DistanceManager";

export class GameManager {
    private static instance: GameManager;
    private roadManager!: RoadManager;

    private isGamePaused: boolean;
    private isGameStarted: boolean;
    private isGameOver: boolean;

    private timeManager: TimeManager;
    private scoreManager: ScoreManager;
    private distanceManager: DistanceManager;

    private constructor() {
        this.isGamePaused = false;
        this.isGameStarted = false;
        this.isGameOver = false;

        this.timeManager = new TimeManager();
        this.scoreManager = new ScoreManager();
        this.distanceManager = new DistanceManager();
    }

    public static getInstance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    public setRoadManager(roadManager: RoadManager): void {
        this.roadManager = roadManager;
    }


    public startGame(): void {
        this.isGameStarted = true;
        this.isGamePaused = false;
        this.isGameOver = false;
        this.timeManager.resetTime();
        this.scoreManager.resetScore();
        this.distanceManager.resetDistance();
    }

    public pauseGame(): void {
        if (this.isGameStarted && !this.isGameOver) {
            this.isGamePaused = true;
            console.log("Game paused.");
        }
    }

    public resumeGame(): void {
        if (this.isGameStarted && this.isGamePaused && !this.isGameOver) {
            this.isGamePaused = false;
            console.log("Game resumed.");
        }
    }

    public endGame(): void {
        if (this.isGameStarted) {
            this.isGameStarted = false;
            this.isGameOver = true;
            this.isGamePaused = false;
            console.log("Game over.");
        }
    }

    public updateTime(delta: number): void {
        if (this.isGameStarted && !this.isGameOver && !this.isGamePaused) {
            this.timeManager.updateTime(delta);
        }
    }

    public getTime(): number {
        return this.timeManager.getTime();
    }

    public addScore(points: number): void {
        if (this.isGameStarted && !this.isGameOver) {
            this.scoreManager.addScore(points);
        }
    }

    public getScore(): number {
        return this.scoreManager.getScore();
    }

    public updateDistance(delta: number): void {
        if (this.isGameStarted && !this.isGameOver && !this.isGamePaused) {
            this.distanceManager.updateDistance(delta);
        }
    }

    public getDistance(): number {
        return this.distanceManager.getDistance();
    }

    public replayGame(): void {
        this.startGame();

        if (this.roadManager) {
            this.roadManager.resetRoads();
        }
        if (this.player) {
            this.player.reset();
        }
        console.log("Game replayed.");
    }

    public isPaused(): boolean {
        return this.isGamePaused;
    }

    public isStarted(): boolean {
        return this.isGameStarted;
    }

    public isOver(): boolean {
        return this.isGameOver;
    }
}
