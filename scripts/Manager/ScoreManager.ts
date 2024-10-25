export class ScoreManager {
    private score: number;

    constructor() {
        this.score = 0;
    }

    public addScore(points: number): void {
        this.score += points;
    }

    public getScore(): number {
        return this.score;
    }

    public resetScore(): void {
        this.score = 0;
    }
}
