import { MessuarementSystem } from 'enums/messuarement-system';

export class LocalStorageService {
    private _savedIngredientIds: number[] = [];
    private _favoriteCocktails: number[] = [];
    private _messuarementSystem: MessuarementSystem;

    constructor() {
        const item = this.getFromLocalStorage('saved-ingredients');
        this._savedIngredientIds = item !== null ? item : [];

        const messuarementSystem = this.getFromLocalStorage('messuarement-system');
        this._messuarementSystem = messuarementSystem ?? MessuarementSystem.Imperial;

        const favoriteCocktails = this.getFromLocalStorage('favorite-cocktails');
        this._favoriteCocktails = favoriteCocktails !== null ? favoriteCocktails : [];
    }

    public updateIngredients(numbers: number[]) {
        this.updateKey('saved-ingredients', JSON.stringify(numbers));
        this._savedIngredientIds = numbers;
    }

    public updateMessuarmentSystem(system: MessuarementSystem) {
        this.updateKey('messuarement-system', system);
        this._messuarementSystem = system;
    }

    public updateFavoriteCocktails(numbers: number[]) {
        this.updateKey('favorite-cocktails', JSON.stringify(numbers));
        this._favoriteCocktails = numbers;
    }

    public getIngredientIds() {
        return this._savedIngredientIds;
    }

    public getMessuarementSystem() {
        return this._messuarementSystem;
    }

    public getFavoriteCocktails() {
        return this._favoriteCocktails;
    }

    private updateKey(key: string, value: string) {
        localStorage.removeItem(key);
        localStorage.setItem(key, value);
    }

    private getFromLocalStorage(key: string) {
        const data = localStorage.getItem(key);
        if (data !== null) {
            try {
                return JSON.parse(data);
            } catch {
                localStorage.removeItem(key);
            }
        }
        return null;
    }
}
