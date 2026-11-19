import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.SMOKE_BASE_URL || "http://localhost:3000";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await mkdir("test-artifacts", { recursive: true });
try {
  await page.goto(base, { waitUntil: "domcontentloaded" });
  assert.equal(await page.title(), "Fieldwork Home | Plan smarter. Make more of home.");
  assert.equal(await page.getByRole("heading", { name: "Make more of home." }).isVisible(), true);
  await page.screenshot({ path: "test-artifacts/home-desktop.png", fullPage: true });

  await page
    .getByRole("link", { name: /Explore calculators/ })
    .first()
    .click();
  await page.waitForURL("**/calculators");
  assert.equal(new URL(page.url()).pathname, "/calculators");
  await page
    .getByRole("link", { name: /Paint calculator/ })
    .first()
    .click();
  await page.waitForURL("**/calculators/paint");
  await page.getByRole("button", { name: /Calculate estimate/ }).click();
  assert.equal(await page.getByText("2 gallons", { exact: true }).isVisible(), true);
  await page.getByLabel("Room length").fill("0");
  await page.getByRole("button", { name: /Calculate estimate/ }).click();
  assert.equal(await page.getByText("Enter a number greater than zero.").isVisible(), true);
  await page.getByRole("button", { name: "Reset" }).click();
  assert.equal(await page.getByText("Your project, measured").isVisible(), true);

  await page.goto(`${base}/calculators/tile`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Calculate estimate/ }).click();
  assert.equal(await page.getByText("88 tiles", { exact: true }).isVisible(), true);
  await page.getByLabel("Measurement units").selectOption("metric");
  await page.getByLabel("Room length").fill("2");
  await page.getByLabel("Room width").fill("2");
  await page.getByLabel("Tile length").fill("50");
  await page.getByLabel("Tile width").fill("50");
  await page.getByLabel("Waste allowance").fill("0");
  await page.getByRole("button", { name: /Calculate estimate/ }).click();
  assert.equal(await page.getByText("16 tiles", { exact: true }).isVisible(), true);

  await page.goto(`${base}/calculators/drywall`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Calculate estimate/ }).click();
  assert.equal(await page.getByText("10 sheets", { exact: true }).isVisible(), true);

  await page.goto(`${base}/search`, { waitUntil: "domcontentloaded" });
  await page.getByRole("searchbox", { name: "Search resources" }).fill("paint");
  await page.getByRole("button", { name: "Search" }).click();
  await page.waitForURL("**/search?q=paint");
  assert.equal(
    await page
      .getByRole("link", { name: /Paint calculator/ })
      .first()
      .isVisible(),
    true,
  );
  await page.goto(`${base}/projects/paint-an-interior-room`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.getByRole("heading", { name: "Repair and prepare" }).isVisible(), true);
  await page.goto(`${base}/guides/choosing-interior-paint-finish`, {
    waitUntil: "domcontentloaded",
  });
  assert.equal(
    await page.getByRole("heading", { name: "Choosing an interior paint finish" }).isVisible(),
    true,
  );

  await page.goto(`${base}/admin`, { waitUntil: "domcontentloaded" });
  assert.equal(new URL(page.url()).pathname, "/admin/login");
  assert.equal(await page.getByText("CMS setup required.").isVisible(), true);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: "domcontentloaded" });
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    true,
  );
  assert.equal(await page.getByRole("button", { name: "Open menu" }).isVisible(), true);
  await page.getByRole("button", { name: "Open menu" }).click();
  assert.equal(await page.getByRole("navigation", { name: "Mobile navigation" }).isVisible(), true);
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Home Maintenance" })
    .click();
  await page.waitForURL("**/home-maintenance");
  assert.equal(new URL(page.url()).pathname, "/home-maintenance");
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: "test-artifacts/home-mobile.png", fullPage: true });
  await page.goto(`${base}/calculators/paint`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.getByLabel("Room length").isVisible(), true);
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    true,
  );
  await page.getByRole("button", { name: /Calculate estimate/ }).click();
  assert.equal(await page.getByText("2 gallons", { exact: true }).isVisible(), true);
  await page.screenshot({ path: "test-artifacts/paint-mobile.png", fullPage: true });
  console.log(
    "Browser journeys passed: homepage, navigation, search, calculators, content, admin protection, mobile menu.",
  );
} finally {
  await browser.close();
}
