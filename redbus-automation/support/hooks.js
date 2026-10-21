const {
  After,
  Before,
  Status,
  setDefaultTimeout,
} = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const config = require('../config/environment');
const installHttp1BrowserBridge = require('./http1-browser-bridge');

setDefaultTimeout(60_000);

function safeFileName(name) {
  return name.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-|-$/g, '');
}

Before(async function ({ pickle }) {
  this.scenarioName = pickle.name;
  this.browser = await chromium.launch({
    headless: config.headless,
    proxy: config.browserProxy,
  });
  this.context = await this.browser.newContext({
    acceptDownloads: false,
    recordVideo: { dir: config.artifacts.videos },
    viewport: { width: 1440, height: 1000 },
  });
  if (config.http1Bridge) {
    await installHttp1BrowserBridge(this.context, config.baseUrl);
  }
  await this.context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  const page = await this.context.newPage();
  this.setPageObjects(page);
  this.video = page.video();
});

After(async function ({ result }) {
  const failed = result?.status === Status.FAILED;
  const fileName = `${Date.now()}-${safeFileName(this.scenarioName)}`;
  const screenshotPath = path.join(config.artifacts.screenshots, `${fileName}.png`);
  const tracePath = path.join(config.artifacts.traces, `${fileName}.zip`);
  let videoPath;

  try {
    if (failed && this.page) {
      const screenshot = await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });
      await this.attach(screenshot, 'image/png');
    }

    if (this.context) {
      await this.context.tracing.stop(failed ? { path: tracePath } : undefined);
    }
  } finally {
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  if (this.video) {
    videoPath = await this.video.path();
    if (failed) {
      const retainedVideoPath = path.join(
        config.artifacts.videos,
        `${fileName}.webm`,
      );
      await fs.rename(videoPath, retainedVideoPath);
    } else {
      await fs.unlink(videoPath);
    }
  }
});
