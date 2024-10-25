import * as pc from "playcanvas";
import { RoadManager } from "./RoadManager";
import { Character } from "../Entities/Character";

export class GameManager {
    private static instance: GameManager;
    private roadManager!: RoadManager;
    private player!: Character;

    private isGamePaused: boolean;
    private isGameStarted: boolean;
    private isGameOver: boolean;
    private score: number;
    private distance: number;
    private time: number;
    private deltaTime: number;

    private constructor() {
        this.isGamePaused = false;
        this.isGameStarted = false;
        this.isGameOver = false;
        this.score = 0;
        this.distance = 0;
        this.time = 0;
        this.deltaTime = 0;
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

    public setPlayer(player: Character): void {
        this.player = player;
    }

    public startGame(): void {
        this.isGameStarted = true;
        this.isGamePaused = false;
        this.isGameOver = false;
        this.score = 0;
        this.distance = 0;
        this.time = 0;
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
            this.deltaTime = delta;
            this.time += this.deltaTime;
        }
    }

    public getTime(): number {
        return this.time;
    }

    public resetTime(): void {
        this.time = 0;
    }

    public addScore(points: number): void {
        if (this.isGameStarted && !this.isGameOver) {
            this.score += points;
        }
    }

    public getScore(): number {
        return this.score;
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

    public updateDistance(delta: number): void {
        if (this.isGameStarted && !this.isGameOver && !this.isGamePaused) {
            this.distance += delta;
        }
    }

    public getDistance(): number {
        return this.distance;
    }

    public resetDistance(): void {
        this.distance = 0;
    }

    public replayGame(): void {
        this.startGame();
        this.resetDistance();
        this.resetTime();
        this.isGameStarted = false;

        if (this.roadManager) {
            this.roadManager.resetRoads();
        }
        if(this.player){
            this.player.reset();
        }
        console.log("Game replayed.");
    }
}
