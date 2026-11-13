import { test, expect } from "@playwright/test";
test("public library can save, review, reload, filter, and reset", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("article")).toHaveCount(12);
  const firstPhoto = page.getByRole("img", { name: "Daru restaurant photo" });
  await expect(firstPhoto).toBeVisible();
  await expect
    .poll(() =>
      firstPhoto.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await expect(page.locator(".trove-app")).toHaveAttribute(
    "data-theme",
    "dark",
  );
  await page.screenshot({
    path: testInfo.outputPath("library.png"),
    fullPage: true,
  });
  await page.getByRole("link", { name: "Save a new place" }).click();
  await page.getByLabel("Restaurant name").fill("My DC discovery");
  await page.getByLabel("Cuisine", { exact: true }).fill("Italian");
  await page.getByRole("button", { name: "Save place", exact: true }).click();
  const card = page.getByRole("article", {
    name: "My DC discovery",
    exact: true,
  });
  await expect(card).toBeVisible();
  await card.getByRole("link", { name: "Write a review" }).click();
  await page.getByLabel("food", { exact: true }).selectOption("5");
  await page.getByLabel("Your review").fill("A place to remember.");
  await page.getByRole("button", { name: "Save review", exact: true }).click();
  await page.reload();
  await page.getByLabel("Search places").fill("My DC discovery");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.getByRole("article")).toContainText("A place to remember.");
  await expect(page.getByRole("article")).toContainText("Been there");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.goto("/profile");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await page.goto("/");
  await expect(page.getByRole("article")).toHaveCount(12);
  await page.goto("/auth");
  await expect(page).toHaveURL(/\/profile$/);
  await expect(
    page.getByRole("heading", { name: "Try it. Make it yours." }),
  ).toBeVisible();
});
