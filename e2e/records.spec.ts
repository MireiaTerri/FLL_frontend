import { expect, test } from "@playwright/test";
import { createRecordViaApi, createUserViaApi, hasRecordsApi } from "./utils/api";
import { loginViaUi } from "./utils/auth";
import { createRecordName, createTestUser } from "./utils/test-data";

test("the user profile handles the records section correctly with the hosted backend", async ({ page, request }) => {
    const user = createTestUser("records");
    const supportsRecords = await hasRecordsApi(request);
    const recordName = createRecordName();

    await createUserViaApi(request, user);

    if (supportsRecords) {
        await createRecordViaApi(request, user, recordName);
    }

    await loginViaUi(page, user);

    await page.goto(`/users/${user.username}`);

    await expect(page.getByRole("heading", { name: "Records", exact: true, level: 2 })).toBeVisible();

    if (supportsRecords) {
        await expect(page.getByRole("link", { name: recordName, exact: true })).toBeVisible();
    } else {
        await expect(page.getByRole("alert").filter({ hasText: "Not Found" })).toBeVisible();
    }
});
