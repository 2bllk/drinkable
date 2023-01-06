import { IngredientService } from 'services/ingredient-service';
import { LocalStorageService } from 'services/local-storage-service';
import { I18N } from 'aurelia-i18n';

describe('IngredientService', () => {
    let localStorageService: LocalStorageService;
    let sut: IngredientService;

    beforeEach(async () => {
        localStorageService = new LocalStorageService();
        await localStorageService.initialize();

        let i18n = new I18N(null, null);
        jest.spyOn(i18n, 'tr').mockReturnValue('name');
        sut = new IngredientService(localStorageService, i18n);
    });

    afterEach(() => {
        window.localStorage.clear();
    });

    describe('GET', () => {
        test('Get Ingredients - No initial state', () => {
            expect(sut.getIngredients().length).toBeGreaterThan(0);
            expect(sut.getCreatedIngredients()).toHaveLength(0);
        });

        test('Get Random Ingredients', () => {
            expect(sut.getRandomIngredients(0)).toHaveLength(0);
            expect(sut.getRandomIngredients(3)).toHaveLength(3);
        });

        test('getIngredientAndReplacementIds - Ingredient not found', () => {
            expect(sut.getIngredientAndReplacementIds('error')).toStrictEqual([]);
        });
    });

    describe('Create', () => {
        test('Create Ingredient', async () => {
            let key = 'CapacitorStorage.ingredients';
            expect(window.localStorage.getItem(key)).toBeNull();

            let ingredient = await sut.createIngredient('Test');
            expect(ingredient.id).toBe('x-1');

            expect(window.localStorage.getItem(key)).toBeTruthy();
            expect(sut.getCreatedIngredients()).toStrictEqual([ingredient]);
            expect(sut.getIngredients()).toContain(ingredient);
        });
    });

    describe('Update', () => {
        test('Update Ingredient', async () => {
            let ingredient = await sut.createIngredient('Test');

            let updatedIngredient = { ...ingredient };
            updatedIngredient.name = 'updated';

            await sut.updateIngredient(updatedIngredient);

            expect(ingredient.id).toBe('x-1');
            expect(sut.getCreatedIngredients()).toStrictEqual([updatedIngredient]);
            expect(sut.getIngredients()).toContain(updatedIngredient);
        });
    });

    describe('Delete', () => {
        test('Delete Ingredient', async () => {
            let ingredient = await sut.createIngredient('Test');

            await sut.deleteIngredient(ingredient.id);

            expect(sut.getCreatedIngredients()).toStrictEqual([]);
            expect(sut.getIngredientById(ingredient.id)).toBeUndefined();
        });
    });
});