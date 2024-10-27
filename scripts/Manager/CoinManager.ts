export class CoinManager {
    private static instance: CoinManager;
    private totalCoins: number;
    private sessionCoins: number;

    private constructor() {
        this.totalCoins = this.loadTotalCoins();
        this.sessionCoins = 0;
    }

    public static getInstance(): CoinManager {
        if (!CoinManager.instance) {
            CoinManager.instance = new CoinManager();
        }
        return CoinManager.instance;
    }

    public getTotalCoins(): number {
        return this.totalCoins;
    }

    public addGlobalCoins(amount: number): void {
        this.totalCoins += amount;
        this.saveTotalCoins();
    }

    public deductGlobalCoins(amount: number): boolean {
        if (this.totalCoins >= amount) {
            this.totalCoins -= amount;
            this.saveTotalCoins();
            return true;
        }
        return false;
    }

    public getSessionCoins(): number {
        return this.sessionCoins;
    }

    public addSessionCoins(amount: number): void {
        this.sessionCoins += amount;
    }

    public resetSessionCoins(): void {
        this.sessionCoins = 0;
    }

    public finalizeSession(): void {
        this.addGlobalCoins(this.sessionCoins);
        this.resetSessionCoins();
    }

    private saveTotalCoins(): void {
        localStorage.setItem("totalCoins", this.totalCoins.toString());
    }

    private loadTotalCoins(): number {
        const coins = localStorage.getItem("totalCoins");
        return coins ? parseInt(coins) : 0;
    }
}
