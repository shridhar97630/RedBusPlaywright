# RedBus Automation

The JavaScript, Playwright, Cucumber BDD, and MERV reporting framework lives in
[redbus-automation/](./redbus-automation/README.md).

## Quick start

```powershell
cd redbus-automation
npm ci
npx playwright install chromium
npm test
```

CI runs the same smoke and regression-tagged Gherkin scenarios through GitHub
Actions and uploads MERV reports and failure artifacts.
