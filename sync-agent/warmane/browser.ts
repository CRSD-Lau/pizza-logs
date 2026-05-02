// sync-agent/warmane/browser.ts
import { chromium, Browser } from "playwright";

let _browser: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
  if (_browser && _browser.isConnected()) return _browser;

  // Use headed mode to bypass Cloudflare Bot Fight Mode — headless Chromium
  // is reliably detected by Cloudflare's JS fingerprinting. Since the bridge
  // runs on a Windows desktop, a positioned off-screen window is acceptable.
  // Prefer the real installed Chrome channel; fall back to Playwright Chromium.
  try {
    _browser = await chromium.launch({
      channel: "chrome",
      headless: false,
      args: [
        "--disable-blink-features=AutomationControlled",
        "--window-position=-32000,-32000",
      ],
    });
  } catch {
    _browser = await chromium.launch({
      headless: false,
      args: [
        "--disable-blink-features=AutomationControlled",
        "--window-position=-32000,-32000",
      ],
    });
  }

  return _browser;
}

export async function closeBrowser(): Promise<void> {
  if (_browser) {
    await _browser.close().catch(() => {});
    _browser = null;
  }
}

export async function fetchWarmaneJson(url: string): Promise<unknown> {
  const browser = await getBrowser();
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 },
    locale: "en-US",
    timezoneId: "America/New_York",
    extraHTTPHeaders: {
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  const page = await context.newPage();

  // Mask navigator.webdriver to avoid bot detection
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  try {
    // Intercept API responses before any Cloudflare redirect can hide them.
    // When Cloudflare passes the request through, the XHR/fetch from their
    // challenge JS will hit the real URL and we capture that JSON here.
    let interceptedJson: unknown = null;
    const apiUrlLower = url.toLowerCase();

    page.on("response", async (response) => {
      try {
        const responseUrl = response.url().toLowerCase();
        if (responseUrl.startsWith(apiUrlLower) || apiUrlLower.startsWith(responseUrl)) {
          const contentType = response.headers()["content-type"] ?? "";
          if (contentType.includes("json") || contentType.includes("text/plain")) {
            const body = await response.text().catch(() => "");
            if (body && body.trimStart().startsWith("{") || body.trimStart().startsWith("[")) {
              try {
                interceptedJson = JSON.parse(body);
              } catch {
                // not valid JSON
              }
            }
          }
        }
      } catch {
        // ignore response handler errors
      }
    });

    await page.goto(url, {
      waitUntil: "load",
      timeout: 30_000,
    });

    // If we intercepted a JSON response, return it immediately
    if (interceptedJson !== null) return interceptedJson;

    // Otherwise poll the body text — after CF challenge resolves, the page
    // may navigate to show JSON directly in the body
    const deadline = Date.now() + 20_000;
    while (Date.now() < deadline) {
      const bodyText = await page.evaluate(() => document.body.innerText ?? "").catch(() => "");
      const trimmed = bodyText.trimStart();

      // If the body starts with { or [, it's JSON content
      if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        try {
          return JSON.parse(trimmed);
        } catch {
          return null;
        }
      }

      // If we have an intercepted response by now, return it
      if (interceptedJson !== null) return interceptedJson;

      await page.waitForTimeout(1_000);
    }

    // Final check for intercepted response
    return interceptedJson;
  } finally {
    await page.close().catch(() => {});
    await context.close().catch(() => {});
  }
}
