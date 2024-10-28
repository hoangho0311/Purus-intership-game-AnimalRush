import * as pc from "playcanvas";
import { RoadManager } from "./RoadManager";
import { Character } from "../Entities/Character";
import { TimeManager } from "./TimeManager";
import { CoinManager } from "./CoinManager";
import { DistanceManager } from "./DistanceManager";
import { SoundManager } from "./SoundManager";

export class GameManager {
    private static instance: GameManager;
    private roadManager!: RoadManager;
    private player: Character;

    private isGamePaused: boolean;
    private isGameStarted: boolean;
    private isGameOver: boolean;

    private timeManager: TimeManager;
    private coinManager: CoinManager;
    private distanceManager: DistanceManager;

    private constructor() {
        this.isGamePaused = false;
        this.isGameStarted = false;
        this.isGameOver = false;

        this.timeManager = new TimeManager();
        this.coinManager = CoinManager.getInstance();
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
        this.coinManager.resetSessionCoins();
        this.distanceManager.resetDistance();
        this.player.changeState("run");
    }

    public pauseGame(): void {
        if (this.isGameStarted && !this.isGameOver) {
            this.isGamePaused = true;
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
            this.coinManager.finalizeSession();

            console.log("Game over. Total coins:", this.coinManager.getTotalCoins());
        }
    }

    public stopGame(){
        this.isGameStarted = false;
        this.isGamePaused = false;
        this.isGameOver = false;
        this.timeManager.resetTime();
        this.coinManager.resetSessionCoins();
        this.distanceManager.resetDistance();
        if (this.roadManager) {
            this.roadManager.resetRoads();
        }
        if (this.player) {
            this.player.reset();
            this.player.changeState("idle");
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

    public addCoin(points: number): void {
        if (this.isGameStarted && !this.isGameOver) {
            this.coinManager.addSessionCoins(points);
        }
    }

    public getCoin(): number {
        return this.coinManager.getSessionCoins();
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

    SetPlayer(player: Character){
        this.player = player;
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
