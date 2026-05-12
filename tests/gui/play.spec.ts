import {test, expect} from '@playwright/test';

test.describe('Play pagina', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('/play');
    });

    test('Happy flow', async ({page}) => {

        await test.step('Filling name and class', async () => {
            await page.getByTestId('character-name-input').fill('Dunk');
            await page.getByTestId('character-build-select').click();
            await page.getByRole('option', {name: 'Knight'}).click();
            await page.getByTestId('character-start-button').click();
            await expect(page.getByTestId('character-name')).toContainText('Dunk');
            await expect(page.getByTestId('character-description')).toContainText('A level 1 knight');
            await expect(page.locator('[data-character-stats="Strength"]')).toContainText('6');
            await expect(page.locator('[data-character-stats="Level"]')).toContainText('1');
        });

        await test.step('Button click', async () => {
            await page.getByTestId('clicker-button').click();
            await page.getByTestId('clicker-button').click();
            await page.getByTestId('clicker-button').click();
            await page.getByTestId('clicker-button').click();
            await page.getByTestId('clicker-button').click();
            await expect(page.getByTestId('toast').filter({hasText: 'Click challenge complete! +1 Level'})).toBeVisible();
            await expect(page.locator('[data-task="clicker"]')).toContainText('Great job! You levelled up');
            await expect(page.getByTestId('clicker-button')).toBeDisabled();
            await expect(page.locator('[data-character-stats="Strength"]')).toContainText('7');
            await expect(page.locator('[data-character-stats="Level"]')).toContainText('2');
        });

        await test.step('File upload', async () => {
            await page.getByTestId('uploader-input').setInputFiles({
                name: 'test.txt',
                mimeType: 'text/plain',
                buffer: Buffer.from('this is a test')
            });
            await expect(page.getByTestId('toast').filter({hasText: 'File received! +1 Level'})).toBeVisible();
            await expect(page.locator('[data-task="uploader"]')).toContainText('File selected, level up!');
            await expect(page.getByTestId('uploader-input')).toBeDisabled();
            await expect(page.locator('[data-character-stats="Strength"]')).toContainText('8');
            await expect(page.locator('[data-character-stats="Level"]')).toContainText('3');
        });

        await test.step('Typing', async () => {
            await page.getByTestId('typer-input').fill('Lorem Ipsum');
            await expect(page.getByTestId('toast').filter({hasText: 'Spell cast! +1 Level'})).toBeVisible();
            await expect(page.locator('[data-task="typer"]')).toContainText('Dolar sit amet!');
            await expect(page.getByTestId('typer-input')).toBeDisabled();
            await expect(page.locator('[data-character-stats="Strength"]')).toContainText('9');
            await expect(page.locator('[data-character-stats="Level"]')).toContainText('4');
        });

        await test.step('Sliding', async () => {
            await page.getByRole('slider').press('End');
            await expect(page.getByTestId('toast').filter({hasText: 'Balance mastered! +1 Level'})).toBeVisible();
            await expect(page.locator('[data-task="slider"]')).toContainText('Slid to the next level!');
            await expect(page.getByRole('slider')).toBeDisabled();
            await expect(page.locator('[data-character-stats="Strength"]')).toContainText('10');
            await expect(page.locator('[data-character-stats="Level"]')).toContainText('5');
        });

        await test.step('Check max level', async () => {
            await expect(page.getByTestId('max-level-message')).toBeVisible();
        });

        await test.step('Play again', async () => {
            await page.getByTestId('play-again-button').click();
            await expect(page.getByTestId('character-name')).toContainText('Your character');
            await expect(page.locator('[data-character-stats="Level"]')).toContainText('1');
            await expect(page.getByTestId('character-name-input')).toBeEmpty();
        });

    });

    test('Start without name', async ({page}) => {
        await page.getByTestId('character-start-button').click();
        await expect(page.getByText('Name must be at least 3 characters')).toBeVisible();
    });

    test('Name length less than 3 characters', async ({page}) => {
        await page.getByTestId('character-name-input').fill('AB');
        await page.getByTestId('character-start-button').click();
        await expect(page.getByText('Name must be at least 3 characters')).toBeVisible();
    });

    test('Name length more than 20 characters', async ({page}) => {
        await page.getByTestId('character-name-input').fill('ABCDEFGHIJKLMNOPQRSTU');
        await page.getByTestId('character-start-button').click();
        await expect(page.getByText('Name cannot be longer than 20 characters')).toBeVisible();
    });

    test('Name with special characters', async ({page}) => {
        await page.getByTestId('character-name-input').fill('Dünk-the-1st!😀');
        await page.getByTestId('character-start-button').click();
        await expect(page.getByTestId('character-name')).toContainText('Dünk-the-1st!😀');
    });

    test.describe('Check stats of class', () => {
        const classes = [
            {name: 'Thief', Strength: '1', Agility: '6', Wisdom: '2', Magic: '1', Level: '1'},
            {name: 'Knight', Strength: '6', Agility: '2', Wisdom: '1', Magic: '1', Level: '1'},
            {name: 'Mage', Strength: '0', Agility: '1', Wisdom: '3', Magic: '6', Level: '1'},
            {name: 'Brigadier', Strength: '3', Agility: '1', Wisdom: '6', Magic: '1', Level: '1'},
        ];
        for (const characterClass of classes) {
            test(`${characterClass.name}`, async ({page}) => {
                await page.getByTestId('character-name-input').fill(characterClass.name);
                await page.getByTestId('character-build-select').click();
                await page.getByRole('option', {name: characterClass.name}).click();
                await page.getByTestId('character-start-button').click();
                await expect(page.getByTestId('character-description')).toContainText(`${characterClass.name.toLowerCase()}`);
                await expect(page.locator('[data-character-stats="Strength"]')).toContainText(characterClass.Strength);
                await expect(page.locator('[data-character-stats="Agility"]')).toContainText(characterClass.Agility);
                await expect(page.locator('[data-character-stats="Wisdom"]')).toContainText(characterClass.Wisdom);
                await expect(page.locator('[data-character-stats="Magic"]')).toContainText(characterClass.Magic);
            });
        }
    });

    test('BERSERK!', async ({page}) => {
        await page.getByTestId('character-name-input').fill('Guts');
        await page.getByTestId('character-start-button').click();
        await page.getByTestId('typer-input').fill('all your base are belong to us');
        await expect(page.getByTestId('toast')).toContainText('BERSERK MODE ACTIVATED!');
        await page.getByTestId('typer-input').fill('Lorem Ipsum');
        await expect(page.locator('[data-character-stats="Strength"]')).toContainText('10');
        await expect(page.locator('[data-character-stats="Agility"]')).toContainText('10');
        await expect(page.locator('[data-character-stats="Wisdom"]')).toContainText('10');
        await expect(page.locator('[data-character-stats="Magic"]')).toContainText('10');
    });
});