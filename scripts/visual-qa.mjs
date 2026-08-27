import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const port = 3010;
const url = process.env.DECAT_BASE_URL || `http://127.0.0.1:${port}`;
const server = process.env.DECAT_BASE_URL ? null : spawn("./node_modules/.bin/next", ["dev", "-H", "127.0.0.1", "-p", String(port)], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"],
});

server?.stdout.on("data", (chunk) => process.stdout.write(chunk));
server?.stderr.on("data", (chunk) => process.stderr.write(chunk));

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("Local site did not become ready in time.");
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  desktop.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await desktop.goto(url, { waitUntil: "networkidle" });
  await desktop.screenshot({ path: "/private/tmp/decat-desktop.png", fullPage: false });
  await desktop.locator("#pricing").screenshot({ path: "/private/tmp/decat-pricing.png" });
  const pricingCards = await desktop.locator(".price-card").count();
  await desktop.getByRole("button", { name: "Choose Essential" }).click();
  const bookingPackageSelected = await desktop.locator('input[name="package"][value="essential"]').isChecked();
  await desktop.locator(".addon").filter({ hasText: "Event photography" }).locator("input").check();
  const bookingEstimate = await desktop.locator(".estimate-row strong").innerText();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await mobile.goto(url, { waitUntil: "networkidle" });
  await mobile.screenshot({ path: "/private/tmp/decat-mobile.png", fullPage: false });
  await mobile.getByRole("button", { name: "Open menu" }).click();
  await mobile.getByRole("link", { name: "Pricing" }).waitFor({ state: "visible" });
  const pricingLinkVisible = await mobile.getByRole("link", { name: "Pricing" }).isVisible();

  console.log(JSON.stringify({
    title: await desktop.title(),
    pricingCards,
    bookingPackageSelected,
    bookingEstimate,
    mobileMenu: pricingLinkVisible,
    consoleErrors: errors,
  }, null, 2));
} finally {
  if (browser) await browser.close();
  server?.kill("SIGTERM");
}
