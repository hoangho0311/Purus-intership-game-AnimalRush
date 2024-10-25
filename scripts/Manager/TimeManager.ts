export class TimeManager {
    private time: number;
    private deltaTime: number;

    constructor() {
        this.time = 0;
        this.deltaTime = 0;
    }

    public updateTime(delta: number): void {
        this.deltaTime = delta;
        this.time += this.deltaTime;
    }

    public getTime(): number {
        return this.time;
    }

    public resetTime(): void {
        this.time = 0;
    }
}
