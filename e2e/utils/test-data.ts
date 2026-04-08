export type TestUser = {
    username: string;
    email: string;
    password: string;
};

function randomSuffix() {
    return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
}

function createPassword() {
    return crypto.randomUUID();
}

export function createTestUser(prefix = "e2e-user"): TestUser {
    const username = `${prefix}-${randomSuffix()}`;

    return {
        username,
        email: `${username}@example.com`,
        password: createPassword(),
    };
}

export function createRecordName() {
    return `E2E Record ${randomSuffix()}`;
}
