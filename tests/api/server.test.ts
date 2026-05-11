import {describe, expect, test} from 'vitest'

async function api(path: string) {
    const response = await fetch(`http://localhost:3001${path}`);
    const body = await response.json();
    return { status: response.status, body };
}
describe('GET /api/builds', () => {

    test('Get all builds', async () => {
        const { status, body } = await api('/api/builds');
        expect(status).toBe(200);
        expect(body).toHaveProperty('thief');
        expect(body).toHaveProperty('knight');
        expect(body).toHaveProperty('mage');
        expect(body).toHaveProperty('brigadier');
        expect(Object.keys(body)).toHaveLength(4);
    });

    test('Get specific build', async () => {
        const { status, body } = await api('/api/builds?build=thief');
        expect(status).toBe(200);
        expect(Object.keys(body)).toHaveLength(1);
        expect(body).toHaveProperty('thief.weapon', "knife");
        expect(body).toHaveProperty('thief.strength', 1);
        expect(body).toHaveProperty('thief.agility', 6);
        expect(body).toHaveProperty('thief.wisdom', 2);
        expect(body).toHaveProperty('thief.magic',1);
    });

    test('Get 404 for unknown build', async () => {
        const { status, body } = await api('/api/builds?build=wizard');
        expect(status).toBe(404);
        expect(body.error).toBe("Build 'wizard' not found");
    });
});