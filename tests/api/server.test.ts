import {describe, expect, test} from 'vitest'

async function api(method: 'GET' | 'POST', path: string, body?: object) {
    const response = await fetch(`http://localhost:3001${path}`, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: body ? JSON.stringify(body) : undefined,
    });
    const json = await response.json();
    return {status: response.status, body: json};
}

describe('GET /api/builds', () => {

    test('Get all builds', async () => {
        const {status, body} = await api('GET', '/api/builds');
        expect(status).toBe(200);
        expect(body).toHaveProperty('thief');
        expect(body).toHaveProperty('knight');
        expect(body).toHaveProperty('mage');
        expect(body).toHaveProperty('brigadier');
        expect(Object.keys(body)).toHaveLength(4);
    });

    test('Get specific build', async () => {
        const {status, body} = await api('GET', '/api/builds?build=thief');
        expect(status).toBe(200);
        expect(Object.keys(body)).toHaveLength(1);
        expect(body).toHaveProperty('thief.weapon', "knife");
        expect(body).toHaveProperty('thief.strength', 1);
        expect(body).toHaveProperty('thief.agility', 6);
        expect(body).toHaveProperty('thief.wisdom', 2);
        expect(body).toHaveProperty('thief.magic', 1);
    });

    test('Get 404 for unknown build', async () => {
        const {status, body} = await api('GET', '/api/builds?build=wizard');
        expect(status).toBe(404);
        expect(body.error).toBe("Build 'wizard' not found");
    });
});

describe('POST /api/builds', () => {

    test('Create custom build', async () => {
        const {status, body} = await api('POST', '/api/builds', {
            build: {name: 'PALADIN', strength: 3, agility: 2, wisdom: 3, magic: 2}
        });
        expect(status).toBe(201);
        expect(body).toHaveProperty('build');
        expect(body.build.name).toBe('paladin');
        expect(body.build.strength).toBe(3);
        expect(body.build.agility).toBe(2);
        expect(body.build.wisdom).toBe(3);
        expect(body.build.magic).toBe(2);
    });

    test('400 status when there is no body', async () => {
        const {status, body} = await api('POST', '/api/builds', {});
        expect(status).toBe(400);
        expect(body.error).toBe("Request body must contain a 'build' object");
    });

    test('400 status when there is no build object', async () => {
        const {status, body} = await api('POST', '/api/builds', {
            name: 'test'
        });
        expect(status).toBe(400);
        expect(body.error).toBe("Request body must contain a 'build' object");
    });

    describe('Name validation', () => {

        test('409 response when build already exists', async () => {
            const {status, body} = await api('POST', '/api/builds', {
                build: {name: 'PALADIN', strength: 3, agility: 2, wisdom: 3, magic: 2}
            });
            expect(status).toBe(409);
            expect(body.error).toBe("Build name 'paladin' already exists");
        });

        test('409 response when build already exists - lower case', async () => {
            const {status, body} = await api('POST', '/api/builds', {
                build: {name: 'paladin', strength: 1, agility: 1, wisdom: 1, magic: 1}
            });
            expect(status).toBe(409);
            expect(body.error).toBe("Build name 'paladin' already exists");
        });

        test('409 response when non-custom build already exists', async () => {
            const {status, body} = await api('POST', '/api/builds', {
                build: {name: 'knight', strength: 1, agility: 1, wisdom: 1, magic: 1}
            });
            expect(status).toBe(409);
            expect(body.error).toBe("Build name 'knight' already exists");
        });

        test('400 response when name is empty', async () => {
            const {status, body} = await api('POST', '/api/builds', {
                build: {name: '', strength: 1, agility: 1, wisdom: 1, magic: 1}
            });
            expect(status).toBe(400);
            expect(body.error).toBe("'name' must be a non-empty string");
        });

        test('400 response without name', async () => {
            const {status, body} = await api('POST', '/api/builds', {
                build: {strength: 1, agility: 1, wisdom: 1, magic: 1}
            });
            expect(status).toBe(400);
            expect(body.error).toBe("'name' must be a non-empty string");
        });

        describe('Stats validation', () => {

            test('400 response when stat exceeds max value', async () => {
                const {status, body} = await api('POST', '/api/builds', {
                    build: {name: 'tooHigh', strength: 11, agility: 0, wisdom: 0, magic: 0}
                });
                expect(status).toBe(400);
                expect(body.error).toBe("'strength' cannot exceed 10");
            });

            test('400 response when sum of stats is higher than 10', async () => {
                const {status, body} = await api('POST', '/api/builds', {
                    build: {name: 'overpowered', strength: 3, agility: 3, wisdom: 3, magic: 2}
                });
                expect(status).toBe(400);
                expect(body.error).toBe("The sum of all stats cannot exceed 10");
            });

            test('400 response when stat is negative', async () => {
                const {status, body} = await api('POST', '/api/builds', {
                    build: {name: 'negative', strength: -1, agility: 2, wisdom: 3, magic: 3}
                });
                expect(status).toBe(400);
                expect(body.error).toBe("'strength' cannot be negative");
            });

            test('400 response when stat is not an integer - A', async () => {
                const {status, body} = await api('POST', '/api/builds', {
                    build: {name: 'varChar', strength: "A", agility: 2, wisdom: 3, magic: 3}
                });
                expect(status).toBe(400);
                expect(body.error).toBe("'strength' must be an integer");
            });

            test('400 response when stat is not an integer - 1.5', async () => {
                const {status, body} = await api('POST', '/api/builds', {
                    build: {name: 'float', strength: 1.5, agility: 2, wisdom: 3, magic: 3}
                });
                expect(status).toBe(400);
                expect(body.error).toBe("'strength' must be an integer");
            });

            test('400 response when stat is missing', async () => {
                const {status, body} = await api('POST', '/api/builds', {
                    build: {name: 'missing', strength: 3, agility: 3, wisdom: 3}
                });
                expect(status).toBe(400);
                expect(body.error).toBe("'magic' must be an integer");
            });
        });
    });
});