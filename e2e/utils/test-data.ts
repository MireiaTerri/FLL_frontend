export type TestUser = {
    username: string;
    email: string;
    password: string;
};

export const E2E_PASSWORD = "password123";

function randomSuffix() {
    return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
}

export function createTestUser(prefix = "e2e-user"): TestUser {
    const username = `${prefix}-${randomSuffix()}`;

    return {
        username,
        email: `${username}@example.com`,
        password: E2E_PASSWORD,
    };
}

export function createRecordName() {
    return `E2E Record ${randomSuffix()}`;
}
