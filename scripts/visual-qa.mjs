import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const port = 3010;
const url = process.env.DECAT_BASE_URL || `http://127.0.0.1:${port}`;
const server = process.env.DECAT_BASE_URL ? null : spawn("./node_modules/.bin/next", ["dev", "-H", "127.0.0.1", "-p", String(port)], { cwd: process.cwd(), stdio: ["ignore", "pipe", "pipe"] });
server?.stdout.on("data", (chunk) => process.stdout.write(chunk));
server?.stderr.on("data", (chunk) => process.stderr.write(chunk));

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { if ((await fetch(url)).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("Local site did not become ready.");
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ["clipboard-read", "clipboard-write"], reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const routes = ["/", "/services", "/work", "/pricing", "/contact"];
  const screenshots = [];
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      const response = await page.goto(`${url}${route}`, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200, `${route} loads`);
      assert.equal(await page.locator("main h1").count(), 1, `${route} has a clear page heading`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(overflow, false, `${route} must fit at ${width}px`);
      assert.equal(await page.locator('nav a[aria-current="page"]').getAttribute("href"), route);
      await page.evaluate(() => Promise.all([...document.images].map((image) => { image.loading = "eager"; return image.decode().catch(() => {}); })));
      const brokenImages = await page.locator("img").evaluateAll((images) => images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.src));
      assert.deepEqual(brokenImages, []);
      if (width === 1440 || width === 390) {
        const path = `/private/tmp/decat-${route === "/" ? "home" : route.slice(1)}-${width}.png`;
        await page.screenshot({ path, fullPage: true });
        screenshots.push(path);
      }
    }
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${url}/pricing`);
  await page.getByRole("link", { name: "Choose Essential" }).click();
  await page.waitForURL("**/contact?package=essential");
  assert.equal(await page.locator('select[name="package"]').inputValue(), "essential");
  assert.equal(await page.locator(".estimate strong").innerText(), "₱85,000");
  await page.getByRole("button", { name: "Prepare inquiry" }).click();
  assert.equal(await page.locator(".inquiry-draft").count(), 0, "Invalid form must not prepare an inquiry");
  await page.getByLabel("Name", { exact: true }).fill("Test Producer");
  await page.getByLabel("Email", { exact: true }).fill("producer@example.com");
  await page.getByLabel("Event type").selectOption("Product launch");
  await page.locator('input[name="guests"]').fill("300");
  await page.locator(".optional-details summary").click();
  await page.getByRole("checkbox", { name: "Photography" }).check();
  assert.equal(await page.locator(".estimate strong").innerText(), "₱140,000");
  await page.getByLabel("Anything else?").fill("A concise launch event brief.");
  await page.getByRole("button", { name: "Prepare inquiry" }).click();
  await page.getByRole("heading", { name: "Your inquiry is ready." }).waitFor();
  const emailUrl = new URL(await page.getByRole("link", { name: "Open email app" }).getAttribute("href"));
  const emailBody = emailUrl.searchParams.get("body");
  for (const value of ["Test Producer", "producer@example.com", "Product launch", "Essential", "Photography", "₱140,000", "A concise launch event brief."]) assert.ok(emailBody.includes(value), `${value} included in inquiry`);
  await page.getByRole("button", { name: "Copy inquiry" }).click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), emailBody);
  await page.getByLabel("Name", { exact: true }).fill("Updated Producer");
  assert.equal(await page.locator(".inquiry-draft").count(), 0, "Editing clears a stale draft");
  await page.locator('input[name="guests"]').fill("0");
  assert.equal(await page.locator('input[name="guests"]').evaluate((input) => input.validity.valid), false);
  await page.goto(`${url}/contact?package=invalid`);
  assert.equal(await page.locator('select[name="package"]').inputValue(), "");
  await page.goto(`${url}/services`);
  await page.locator("#broadcast").getByRole("link", { name: "Discuss your project" }).click();
  await page.waitForURL("**/contact?service=broadcast");
  assert.equal(await page.getByLabel("Event type").inputValue(), "Broadcast / livestream");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded"), "false");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Pricing" }).click();
  await page.waitForURL("**/pricing");
  assert.equal(await page.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded"), "false");
  await page.goBack();
  assert.equal(new URL(page.url()).pathname, "/");
  assert.equal(await page.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded"), "false");

  await page.goto(`${url}/work`);
  const video = page.locator("video");
  assert.equal(await video.getAttribute("preload"), "none");
  await video.evaluate(async (element) => { element.muted = true; await element.play(); });
  await page.waitForFunction(() => document.querySelector("video").currentTime > 0);
  const videoDuration = await video.evaluate((element) => { element.pause(); return element.duration; });
  assert.ok(videoDuration > 0);
  assert.deepEqual(errors, [], "No browser errors");
  console.log(JSON.stringify({ routes: routes.length, widths: [1440, 768, 390, 320], packageSelection: "passed", estimateAndDraft: "passed", mobileNavigation: "passed", videoPlayback: "passed", videoDuration, consoleErrors: errors, screenshots }, null, 2));
} finally {
  if (browser) await browser.close();
  server?.kill("SIGTERM");
}
