export class DistanceManager {
    distance: number;
    topDistances: number[];

    constructor() {
        this.distance = 0;
        this.topDistances = this.loadTopDistances();
    }

    updateDistance(delta: number): void {
        this.distance += delta;
    }

    getDistance(): number {
        return this.distance;
    }

    getTopDistances(): number[] {
        return this.topDistances;
    }

    resetDistance(): void {
        this.distance = 0;
    }

    updateHighestDistance(): void {
        if (this.topDistances.length < 5 || this.distance > Math.min(...this.topDistances)) {
            this.topDistances.push(this.distance);

            this.topDistances.sort((a, b) => b - a);

            if (this.topDistances.length > 5) {
                this.topDistances.pop();
            }

            this.saveTopDistances();
        }
    }

    saveTopDistances(): void {
        localStorage.setItem("topDistances", JSON.stringify(this.topDistances));
    }

    loadTopDistances(): number[] {
        const savedDistances = localStorage.getItem("topDistances");
        return savedDistances ? JSON.parse(savedDistances) : [];
    }
}
