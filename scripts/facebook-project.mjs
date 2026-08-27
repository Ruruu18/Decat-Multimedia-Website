import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto("https://www.facebook.com/photo/?fbid=4435524200065575&set=pcb.4435529723398356", {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  await page.waitForTimeout(6000);
  const metadata = {};
  for (const property of ["og:title", "og:description", "og:image"]) {
    metadata[property] = await page.locator(`meta[property="${property}"]`).getAttribute("content").catch(() => null);
  }
  const images = await page.locator("img").evaluateAll((nodes) =>
    nodes
      .map((node) => ({
        src: node.currentSrc || node.src,
        alt: node.alt,
        width: node.naturalWidth,
        height: node.naturalHeight,
      }))
      .filter((image) => image.src && image.width >= 500 && image.height >= 300)
      .slice(0, 8),
  );
  await page.screenshot({ path: "/private/tmp/decat-facebook-project.png", fullPage: false });
  console.log(JSON.stringify({ title: await page.title(), metadata, images }, null, 2));
} finally {
  await browser.close();
}
