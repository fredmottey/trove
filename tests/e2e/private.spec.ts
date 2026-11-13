import { test, expect } from "@playwright/test";
test("invited member has durable private places", async ({ page }) => {
  test.skip(
    !process.env.TROVE_TEST_EMAIL,
    "Requires disposable local Supabase credentials.",
  );
  await page.goto("/profile");
  await page
    .getByLabel("Email", { exact: true })
    .fill(process.env.TROVE_TEST_EMAIL!);
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.TROVE_TEST_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByText(
      "Your private library · Only you can see your places and reviews.",
    ),
  ).toBeVisible();
  await page.goto("/add-review");
  await page.getByLabel("Restaurant name").fill("Private CI place");
  await page.getByRole("button", { name: "Save place", exact: true }).click();
  await page.reload();
  const card = page.getByRole("article", {
    name: "Private CI place",
    exact: true,
  });
  await expect(card).toBeVisible();
  page.once("dialog", (d) => d.accept());
  await card.getByRole("button", { name: "Delete place" }).click();
  await expect(card).toHaveCount(0);
});
