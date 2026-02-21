import { test, expect } from "@playwright/test";

test.describe("Művészek oldal", () => {
  test("megjelenik a címsor és a szűrők", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Művészek" })
    ).toBeVisible();
    await expect(
      page.getByText("Hungaroton előadók és szerzők listája")
    ).toBeVisible();

    await expect(page.getByLabel("Keresés név szerint")).toBeVisible();
    await expect(page.getByLabel("Művész típus")).toBeVisible();
    await expect(page.getByLabel("Kezdőbetű")).toBeVisible();
  });

  test("betöltés után megjelennek a művész kártyák vagy üres/hiba üzenet", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.locator("[data-testid=artist-list], [data-testid=artist-list-empty], [data-testid=error-alert]").first()
    ).toBeVisible({ timeout: 25_000 });

    const list = page.getByTestId("artist-list");
    if (await list.isVisible()) {
      const cards = list.locator("li");
      await expect(cards.first()).toBeVisible();
      expect(await cards.count()).toBeGreaterThanOrEqual(1);
      expect(await cards.count()).toBeLessThanOrEqual(50);
    }
  });

  test("a lapozás látható és mutatja a tartományt", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("artist-list")).toBeVisible({
      timeout: 25_000,
    });

    const nav = page.getByRole("navigation", { name: "Lapozás" });
    await expect(nav).toBeVisible();
    await expect(nav.getByText(/1–50 \/ \d+ művész/)).toBeVisible();
    await expect(nav.getByRole("button", { name: "Előző" })).toBeDisabled();
    await expect(nav.getByRole("button", { name: "Következő" })).toBeEnabled();
  });

  test("Következő gombra a második oldal töltődik és az URL frissül", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByTestId("artist-list")).toBeVisible({
      timeout: 25_000,
    });

    await page.getByRole("navigation", { name: "Lapozás" }).getByRole("button", { name: "Következő" }).click();

    await expect(page).toHaveURL(/\?.*page=2/, { timeout: 5_000 });
    await expect(
      page.getByRole("navigation", { name: "Lapozás" }).getByText(/51–100.*művész/)
    ).toBeVisible({ timeout: 15_000 });
  });

  test("betű szűrő (C) frissíti az URL-t", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.locator("[data-testid=artist-list], [data-testid=artist-list-empty], [data-testid=error-alert]").first()
    ).toBeVisible({ timeout: 25_000 });

    await page.getByLabel("Kezdőbetű").selectOption("C");

    await expect(page).toHaveURL(/\?.*letter=C/, { timeout: 10_000 });
  });

  test("keresés név szerint frissíti az URL-t (debounce után)", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByLabel("Keresés név szerint").fill("Szabo");

    await expect(page).toHaveURL(/\?.*search=Szabo/, { timeout: 10_000 });
  });

  test("üres találat esetén üzenet jelenik meg", async ({ page }) => {
    await page.goto("/?search=NemLetezoMuvész12345XYZ");

    await expect(page.getByTestId("artist-list-empty")).toBeVisible({
      timeout: 10_000,
    });
    await expect(
      page.getByText("Nincs megjeleníthető művész.")
    ).toBeVisible();
  });
});
