const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  const consoleMessages = [];
  const pageErrors = [];

  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleMessages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("http://127.0.0.1:5173", { waitUntil: "networkidle" });
  for (const y of [500, 1000, 1600, 2300, 3100, 3900]) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(350);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(350);
  await page.screenshot({ path: "qa/mathwa-desktop.png", fullPage: true });

  const title = await page.title();
  const chartSvgCount = await page.locator(".recharts-wrapper svg").count();
  const chartBoxes = await page.locator(".recharts-wrapper").evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { width: Math.round(rect.width), height: Math.round(rect.height) };
    })
  );
  const stickyTop = await page.locator("section.sticky").evaluate((node) => getComputedStyle(node).position);

  await page.getByRole("button", { name: "حرج" }).click();
  const criticalRows = await page.locator("section:has-text('خريطة الفروع الحرارية') tbody tr").count();

  await page.getByRole("button", { name: "الشاغرة" }).click();
  await page.getByRole("button", { name: "الشاغرة" }).click();

  await page.locator("section:has-text('خريطة الفروع الحرارية') tbody tr").first().click();
  const drawerVisible = await page.getByRole("heading", { name: /مثوى/ }).last().isVisible();
  await page.screenshot({ path: "qa/mathwa-drawer.png", fullPage: true });
  await page.getByLabel("إغلاق").click();

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("http://127.0.0.1:5173", { waitUntil: "networkidle" });
  for (const y of [500, 1100, 1800, 2600, 3400, 4300, 5200, 6100]) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(250);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  await page.screenshot({ path: "qa/mathwa-mobile.png", fullPage: true });
  const mobileHasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  const vacancyText = await page.locator("section:has-text('أطول ١٠ وحدات شاغرة')").textContent();
  const fakeUnitCodes = ["SL-", "AR-", "NS-", "ML-", "MR-", "SH-", "NJ-", "NZ-", "DL-", "AZ-"].filter((code) =>
    vacancyText.includes(code)
  );
  const mappedVacancyRowsPresent = ["مثوى 13", "13-1006", "مثوى 5", "05-052"].every((value) =>
    vacancyText.includes(value)
  );

  await browser.close();

  console.log(JSON.stringify({
    title,
    chartSvgCount,
    chartBoxes,
    stickyTop,
    criticalRows,
    drawerVisible,
    mobileHasHorizontalOverflow,
    fakeUnitCodes,
    mappedVacancyRowsPresent,
    consoleMessages,
    pageErrors
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
