import * as pc from "playcanvas";

export class GameManager {
    private static instance: GameManager;

    private isGamePaused: boolean;
    private isGameStarted: boolean;
    private isGameOver: boolean;
    private score: number;
    private distance: number;
    
    private constructor() {
        this.isGamePaused = false;
        this.isGameStarted = false;
        this.isGameOver = false;
        this.score = 0;
        this.distance = 0;
    }

    public static getInstance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    public startGame(): void {
        this.isGameStarted = true;
        this.isGamePaused = false;
        this.isGameOver = false;
        this.score = 0;
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
        this.distance += delta;
    }

    public getDistance(): number {
        return this.distance;
    }

    public resetDistance(): void {
        this.distance = 0;
    }
}
