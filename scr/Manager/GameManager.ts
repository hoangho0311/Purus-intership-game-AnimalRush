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

    static getInstance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    setRoadManager(roadManager: RoadManager): void {
        this.roadManager = roadManager;
    }

    startGame(): void {
        this.isGameStarted = true;
        this.isGamePaused = false;
        this.isGameOver = false;
        this.timeManager.resetTime();
        this.coinManager.resetSessionCoins();
        this.distanceManager.resetDistance();
        this.player.changeState("run");
    }

    pauseGame(): void {
        if (this.isGameStarted && !this.isGameOver) {
            this.isGamePaused = true;
        }
    }

    resumeGame(): void {
        if (this.isGameStarted && this.isGamePaused && !this.isGameOver) {
            this.isGamePaused = false;
            console.log("Game resumed.");
        }
    }

    endGame(): void {
        if (this.isGameStarted) {
            this.isGameStarted = false;
            this.isGameOver = true;
            this.isGamePaused = false;
            this.coinManager.finalizeSession();
            this.updateHighestDistance();
        }
    }

    stopGame(){
        this.isGameStarted = false;
        this.isGamePaused = false;
        this.isGameOver = false;
        this.timeManager.resetTime();
        this.distanceManager.resetDistance();
        if (this.roadManager) {
            this.roadManager.resetRoads();
        }
        if (this.player) {
            this.player.reset();
            this.player.changeState("idle");
        }
    }

    updateTime(delta: number): void {
        if (this.isGameStarted && !this.isGameOver && !this.isGamePaused) {
            this.timeManager.updateTime(delta);
        }
    }

    getTime(): number {
        return this.timeManager.getTime();
    }

    addCoin(points: number): void {
        if (this.isGameStarted && !this.isGameOver) {
            this.coinManager.addSessionCoins(points);
        }
    }

    getCoin(): number {
        return this.coinManager.getSessionCoins();
    }

    getTotalCoin():number{
        return this.coinManager.loadTotalCoins();
    }

    updateDistance(delta: number): void {
        if (this.isGameStarted && !this.isGameOver && !this.isGamePaused) {
            this.distanceManager.updateDistance(delta);
        }
    }

    showNewHighScoreText(): boolean{
        if(this.distanceManager.loadTopDistances()[0] <= this.distanceManager.getDistance()){
            return true;
        }
        return false;
    }

    getTopDistances():void{
        this.distanceManager.getTopDistances();
    }

    updateHighestDistance() : void{
        this.distanceManager.updateHighestDistance();
    }

    getDistance(): number {
        return this.distanceManager.getDistance();
    }

    replayGame(): void {
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

    isPaused(): boolean {
        return this.isGamePaused;
    }

    isStarted(): boolean {
        return this.isGameStarted;
    }

    isOver(): boolean {
        return this.isGameOver;
    }
}
