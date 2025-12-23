// ============================================
// FILE: lib/tracking-parser.ts
// ============================================
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

interface TrackingInfo {
  orderId: string;
  orderName: string;
  trackingNumber: string;
  trackingUrl: string;
  carrier: string;
  estimatedDelivery: string | null;
  error?: string;
}

async function fetchUPSTracking(
  trackingNumber: string
): Promise<string | null> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();

    // Set realistic headers to avoid detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    });

    // Hide webdriver property
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });
    });

    await page.goto(`https://www.ups.com/track?tracknum=${trackingNumber}`, {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });

    // Wait a bit for JS to load
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const deliveryDate = await page.evaluate(() => {
      // Try multiple selectors
      const selectors = [
        ".ups-txt_size_xl.ups-st_heading.ups-txt_teal.ups-txt_bold.ng-star-inserted",
        '[data-qa="scheduled-delivery-date"]',
        ".ups-group_highlight",
        '[class*="delivery-date"]',
        '[class*="scheduled-delivery"]',
      ];

      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent && el.textContent.trim()) {
          return el.textContent.trim();
        }
      }

      // Fallback: search page text for date pattern
      const bodyText = document.body.textContent || "";
      const dateMatch = bodyText.match(
        /(?:Scheduled Delivery|Estimated Delivery)[:\s]+([A-Za-z]+,?\s+\d{1,2}\/\d{1,2}\/\d{4})/i
      );
      return dateMatch ? dateMatch[1] : null;
    });

    await browser.close();

    if (!deliveryDate) {
      console.error(`UPS: No delivery date found for ${trackingNumber}`);
    } else {
      console.log(`UPS tracking for ${trackingNumber}: ${deliveryDate}`);
    }

    return deliveryDate;
  } catch (err) {
    await browser.close();
    console.error(`UPS Puppeteer error for ${trackingNumber}:`, err);
    return null;
  }
}

async function fetchFedExTracking(
  trackingNumber: string
): Promise<string | null> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();

    // Set realistic headers
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    });

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });
    });

    await page.goto(
      `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
      {
        waitUntil: "domcontentloaded",
        timeout: 20000,
      }
    );

    // Wait for JS to load
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const deliveryDate = await page.evaluate(() => {
      const selectors = [
        ".deliveryDateTextBetween",
        '[data-test="estimated-delivery-date"]',
        ".shipment-delivery-date",
        '[class*="delivery-date"]',
        '[class*="estimated-delivery"]',
      ];

      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent && el.textContent.trim()) {
          return el.textContent.trim();
        }
      }

      // Fallback
      const bodyText = document.body.textContent || "";
      const dateMatch = bodyText.match(
        /(?:Estimated delivery|Delivery date)[:\s]+([A-Za-z]+,?\s+\d{1,2}\/\d{1,2}\/\d{4})/i
      );
      return dateMatch ? dateMatch[1] : null;
    });

    await browser.close();

    if (!deliveryDate) {
      console.error(`FedEx: No delivery date found for ${trackingNumber}`);
    } else {
      console.log(`FedEx tracking for ${trackingNumber}: ${deliveryDate}`);
    }

    return deliveryDate;
  } catch (err) {
    await browser.close();
    console.error(`FedEx Puppeteer error for ${trackingNumber}:`, err);
    return null;
  }
}

async function fetchUSPSTracking(
  trackingNumber: string
): Promise<string | null> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(
      `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      {
        waitUntil: "networkidle0",
        timeout: 15000,
      }
    );

    // Try multiple possible selectors with timeout handling
    const deliveryDate = await page.evaluate(() => {
      // Try all possible selectors
      const selectors = [
        ".expected_delivery",
        ".expected-delivery",
        '[class*="expected_delivery"]',
        '[class*="delivery-date"]',
        '[data-label="Expected Delivery"]',
        ".delivery-status__status-extra strong",
      ];

      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent) {
          let text = el.textContent.trim();
          // Remove common prefixes
          text = text.replace(
            /^(Expected Delivery Day|Estimated Delivery|Expected Delivery):\s*/i,
            ""
          );
          text = text.replace(/\s+/g, " ").trim();
          return text;
        }
      }

      // If no selector found, look for date patterns in the page
      const bodyText = document.body.textContent || "";
      const dateMatch = bodyText.match(
        /(?:Expected|Estimated)\s+Delivery[:\s]+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i
      );
      return dateMatch ? dateMatch[1] : null;
    });

    await browser.close();

    if (!deliveryDate) {
      console.error(`USPS: No delivery date found for ${trackingNumber}`);
    } else {
      console.log(`USPS tracking for ${trackingNumber}: ${deliveryDate}`);
    }

    return deliveryDate;
  } catch (err) {
    await browser.close();
    console.error(`USPS Puppeteer error for ${trackingNumber}:`, err);
    return null;
  }
}

export async function parseTrackingPage(
  html: string,
  carrier: string
): Promise<string | null> {
  const $ = cheerio.load(html);

  // Common patterns for delivery dates across carriers
  const patterns = [
    // UPS
    { selector: '[data-qa="scheduled-delivery-date"]', attr: null },
    { selector: ".ups-group_highlight", attr: null },

    // FedEx
    { selector: '[data-test="estimated-delivery-date"]', attr: null },
    { selector: ".shipment-delivery-date", attr: null },

    // USPS
    { selector: ".expected_delivery", attr: null },
    { selector: '[data-label="Expected Delivery"]', attr: null },

    // Generic patterns
    { selector: '*:contains("Estimated Delivery")', attr: null },
    { selector: '*:contains("Expected Delivery")', attr: null },
    { selector: '*:contains("Delivery Date")', attr: null },
  ];

  for (const pattern of patterns) {
    const el = $(pattern.selector);
    if (el.length > 0) {
      let text = el.text().trim();

      // Extract date patterns
      const dateMatch =
        text.match(
          /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}\b/i
        ) ||
        text.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/) ||
        text.match(/\b\d{4}-\d{2}-\d{2}\b/);

      if (dateMatch) {
        return dateMatch[0];
      }
    }
  }

  return null;
}

export async function fetchTrackingInfo(
  url: string,
  carrier: string,
  trackingNumber: string
): Promise<string | null> {
  // Use Puppeteer for carrier-specific tracking
  const carrierLower = carrier.toLowerCase();

  if (carrierLower.includes("ups")) {
    console.log(`Using Puppeteer for UPS: ${trackingNumber}`);
    return await fetchUPSTracking(trackingNumber);
  }

  if (carrierLower.includes("fedex")) {
    console.log(`Using Puppeteer for FedEx: ${trackingNumber}`);
    return await fetchFedExTracking(trackingNumber);
  }

  if (carrierLower.includes("usps")) {
    console.log(`Using Puppeteer for USPS: ${trackingNumber}`);
    return await fetchUSPSTracking(trackingNumber);
  }

  // Generic fallback with Puppeteer for unknown carriers
  console.log(`Using generic Puppeteer scraping for ${url}`);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });

    const content = await page.content();
    await browser.close();

    // Extract date from page content
    const dateMatch =
      content.match(
        /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}\b/i
      ) || content.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/);

    return dateMatch ? dateMatch[0] : null;
  } catch (err) {
    await browser.close();
    console.error(`Error with generic scraping for ${url}:`, err);
    return null;
  }
}
