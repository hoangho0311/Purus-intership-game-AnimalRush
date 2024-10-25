export class DistanceManager {
    private distance: number;

    constructor() {
        this.distance = 0;
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
