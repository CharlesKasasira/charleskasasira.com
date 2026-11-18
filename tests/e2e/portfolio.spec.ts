import { expect, test } from "@playwright/test";

test("desktop navigation reaches the About page", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();

  await expect(page).toHaveURL(/\/about$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Building useful things, carefully." }),
  ).toBeVisible();
});

test("mobile menu traps focus, closes with Escape, and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menuButton = page.locator('button[aria-controls="mobile-navigation"]');
  await expect(menuButton).toHaveAccessibleName("Open menu");
  await menuButton.click();

  const dialog = page.getByRole("dialog", { name: "Main navigation" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Charles" })).toBeFocused();

  await menuButton.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: "YouTube" })).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(menuButton).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("dark mode can be enabled from the navigation", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() => window.localStorage.removeItem("theme"));
  await page.goto("/");

  const themeButton = page.locator('button[aria-label^="Switch to"]');
  await expect(themeButton).toHaveAccessibleName("Switch to dark mode");
  await themeButton.click();

  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(themeButton).toHaveAccessibleName("Switch to light mode");
});

test("reduced motion disables reveals and the interactive dot canvas", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const reveal = page.locator(".studio-reveal").first();
  await expect(reveal).toBeVisible();
  await expect(reveal).toHaveCSS("animation-name", "none");
  await expect(reveal).toHaveCSS("opacity", "1");

  const canvas = page.locator(".site-dots-canvas");
  await expect(canvas).toHaveCSS("display", "none");
  await expect(canvas).not.toHaveAttribute("data-active", "true");
});

test("blog index opens a complete article", async ({ page }) => {
  await page.goto("/blog");

  const articleLink = page.locator('a[href^="/blog/"]').first();
  const articleTitle = (await articleLink.getByRole("heading", { level: 3 }).textContent())?.trim();
  expect(articleTitle).toBeTruthy();

  await articleLink.click();
  await expect(page).toHaveURL(/\/blog\/.+/);
  await expect(page.locator("article").getByRole("heading", { level: 1 })).toHaveText(
    articleTitle!,
  );
  await expect(page.locator(".blog-prose")).not.toBeEmpty();
});

test("custom error pages are usable", async ({ page }) => {
  const missingResponse = await page.goto("/this-page-does-not-exist");
  expect(missingResponse?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found." })).toBeVisible();
  await expect(page.locator('meta[name="robots"][content="noindex, nofollow"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );

  await page.goto("/500");
  await expect(
    page.getByRole("heading", { level: 1, name: "Something went wrong." }),
  ).toBeVisible();
});

test("failed API responses remain structured and non-successful", async ({ request }) => {
  const unavailableYouTube = await request.get("/api/youtube");
  expect(unavailableYouTube.status()).toBe(503);
  await expect(unavailableYouTube.json()).resolves.toEqual({
    message: "YouTube data unavailable",
  });

  const removedEndpoint = await request.get("/api/hello");
  expect(removedEndpoint.status()).toBe(404);
});
