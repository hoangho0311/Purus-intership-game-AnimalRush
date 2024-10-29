export class CoinManager {
    static instance: CoinManager;
    totalCoins: number;
    sessionCoins: number;

    constructor() {
        this.totalCoins = this.loadTotalCoins();
        this.sessionCoins = 0;
    }

    static getInstance(): CoinManager {
        if (!CoinManager.instance) {
            CoinManager.instance = new CoinManager();
        }
        return CoinManager.instance;
    }

    getTotalCoins(): number {
        return this.totalCoins;
    }

    addGlobalCoins(amount: number): void {
        this.totalCoins += amount;
        this.saveTotalCoins();
    }

    deductGlobalCoins(amount: number): boolean {
        if (this.totalCoins >= amount) {
            this.totalCoins -= amount;
            this.saveTotalCoins();
            return true;
        }
        return false;
    }

    getSessionCoins(): number {
        return this.sessionCoins;
    }

    addSessionCoins(amount: number): void {
        this.sessionCoins += amount;
    }

    resetSessionCoins(): void {
        this.sessionCoins = 0;
    }

    finalizeSession(): void {
        this.addGlobalCoins(this.sessionCoins);
        this.resetSessionCoins();
    }

    saveTotalCoins(): void {
        localStorage.setItem("totalCoins", this.totalCoins.toString());
    }

    loadTotalCoins(): number {
        const coins = localStorage.getItem("totalCoins");
        return coins ? parseInt(coins) : 0;
    }
}
