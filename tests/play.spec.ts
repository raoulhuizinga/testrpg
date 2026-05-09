import {test, expect} from '@playwright/test';

test('Happy flow', async ({page}) => {

    await test.step('Character creation', async () => {
        await page.goto('http://localhost:3000/play');
        await page.getByTestId('character-name-input').fill('Dunk');
        await page.getByTestId('character-build-select').click();
        await page.getByRole('option', {name: 'Knight'}).click();
        await page.getByTestId('character-start-button').click();
        await expect(page.getByTestId('character-name')).toContainText('Dunk');
        await expect(page.getByTestId('character-description')).toContainText('A level 1 knight');
    });

    await test.step('Button click', async () => {
        await page.getByTestId('clicker-button').click();
        await page.getByTestId('clicker-button').click();
        await page.getByTestId('clicker-button').click();
        await page.getByTestId('clicker-button').click();
        await page.getByTestId('clicker-button').click();
        await expect(page.getByTestId('clicker-button')).toBeDisabled();
        await expect(page.getByText('Great job! You levelled up')).toBeVisible();
    });

    await test.step('File upload', async () => {
        await page.getByTestId('uploader-input').setInputFiles({
            name: 'test.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('this is a test')
        });
        await expect(page.getByTestId('uploader-input')).toBeDisabled();
        await expect(page.getByText('File selected, level up!')).toBeVisible();
    });

    await test.step('Typing', async () => {
        await page.getByTestId('typer-input').fill('Lorem Ipsum');
        await expect(page.getByTestId('typer-input')).toBeDisabled();
        await expect(page.getByText('Dolar sit amet!')).toBeVisible();
    });

    await test.step('Sliding', async () => {
        await page.getByRole('slider').press('End');
        await expect(page.getByRole('slider')).toBeDisabled();
        await expect(page.getByText('Slid to the next level!')).toBeVisible();
    });

    await test.step('Check max level', async () => {
        await expect(page.getByText('Level5')).toBeVisible();
        await expect(page.getByText('Strength10')).toBeVisible();
        await expect(page.getByTestId('max-level-message')).toBeVisible();
    });
});
