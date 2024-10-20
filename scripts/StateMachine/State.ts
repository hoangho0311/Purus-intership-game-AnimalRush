import { Character } from "./Character";
export abstract class State {
    character: Character;

    constructor(character: Character) {
        this.character = character;
    }

    abstract enter(): void;
    abstract update(dt: number): void;
    abstract exit(): void;
}
