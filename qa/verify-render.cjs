const { chromium } = require("playwright");

const fakePrefixes = ["SL-", "AR-", "NS-", "ML-", "MR-", "SH-", "NJ-", "NZ-", "DL-", "AZ-"];
const excludedLabels = ["مثوى 45", "مثوى 54", "مثوى 55", "مثوى 56", "مثوى 57", "مكتب مثوى", "Mathwa Office"];
const marketLabels = ["معيار السوق", "Market Benchmark", "Studio", "1BR", "2BR"];
const mojibakeMarkers = ["Ù", "Ø", "â", "ðŸ"];

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

  async function scrollThrough() {
    for (const y of [500, 1000, 1600, 2300, 3100, 3900, 4700, 5600]) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(250);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);
  }

  async function tableLayoutSnapshot() {
    return page.locator("table.data-table").evaluateAll((tables) =>
      tables.map((table) => {
        const style = getComputedStyle(table);
        const firstHeader = table.querySelector("th");
        const firstCell = table.querySelector("td");
        return {
          tableLayout: style.tableLayout,
          width: Math.round(table.getBoundingClientRect().width),
          headerAlign: firstHeader ? getComputedStyle(firstHeader).textAlign : null,
          cellAlign: firstCell ? getComputedStyle(firstCell).textAlign : null,
          cellVerticalAlign: firstCell ? getComputedStyle(firstCell).verticalAlign : null,
        };
      })
    );
  }

  await page.goto("http://127.0.0.1:5173", { waitUntil: "networkidle" });
  await scrollThrough();
  await page.screenshot({ path: "qa/mathwa-desktop.png", fullPage: true });

  const title = await page.title();
  const chartSvgCount = await page.locator(".recharts-wrapper svg").count();
  const tableLayoutsDesktop = await tableLayoutSnapshot();
  const stickyTop = await page.locator("section.sticky").evaluate((node) => getComputedStyle(node).position);

  await page.locator("section.sticky button").nth(1).click();
  const criticalRows = await page.locator("table.data-table").first().locator("tbody tr").count();

  await page.locator("table.data-table").first().locator("thead button").nth(4).click();
  await page.locator("table.data-table").first().locator("thead button").nth(4).click();

  await page.locator("table.data-table").first().locator("tbody tr").first().click();
  const drawerVisible = await page.getByRole("heading", { name: /مثوى/ }).last().isVisible();
  await page.screenshot({ path: "qa/mathwa-drawer.png", fullPage: true });
  await page.locator("aside button").first().click();

  const pageText = await page.locator("body").textContent();
  const vacancyTable = page.locator("table.data-table").nth(1);
  const vacancyText = await vacancyTable.textContent();
  const fakeUnitCodes = fakePrefixes.filter((code) => vacancyText.includes(code));
  const excludedVisible = excludedLabels.filter((label) => pageText.includes(label));
  const marketVisible = marketLabels.filter((label) => pageText.includes(label));
  const mojibakeVisible = mojibakeMarkers.filter((marker) => pageText.includes(marker));
  const mappedVacancyRowsPresent = ["مثوى 13", "13-1006", "مثوى 5", "05-052"].every((value) =>
    vacancyText.includes(value)
  );
  const allVacantRowsRendered = await vacancyTable.locator("tbody tr").count();

  const responsive = {};
  for (const [name, viewport] of Object.entries({
    laptop: { width: 1280, height: 900 },
    tablet: { width: 820, height: 1180 },
    mobile: { width: 390, height: 900 },
  })) {
    await page.setViewportSize(viewport);
    await page.goto("http://127.0.0.1:5173", { waitUntil: "networkidle" });
    await scrollThrough();
    await page.screenshot({ path: `qa/mathwa-${name}.png`, fullPage: true });
    responsive[name] = {
      horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2),
      tableLayouts: await tableLayoutSnapshot(),
    };
  }

  await browser.close();

  console.log(JSON.stringify({
    title,
    chartSvgCount,
    stickyTop,
    criticalRows,
    drawerVisible,
    allVacantRowsRendered,
    fakeUnitCodes,
    excludedVisible,
    marketVisible,
    mojibakeVisible,
    mappedVacancyRowsPresent,
    tableLayoutsDesktop,
    responsive,
    consoleMessages,
    pageErrors,
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
