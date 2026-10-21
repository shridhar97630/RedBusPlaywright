# RedBus Playwright + Cucumber Automation

An end-to-end browser automation framework for redBus using JavaScript,
Playwright, Cucumber, Gherkin BDD, Page Object Model, and MERV reporting.

## Requirements

- Node.js 24 LTS or later
- npm
- Git

## Quick start

From the repository root:

```powershell
cd redbus-automation
npm ci
npx playwright install chromium
npm test
```

## Test commands

Run commands from `redbus-automation/`:

| Command | Description |
| --- | --- |
| `npm test` | Run the complete BDD suite |
| `npm run test:bdd` | Run the complete Cucumber suite |
| `npm run test:smoke` | Run scenarios tagged `@smoke` |
| `npm run test:regression` | Run scenarios tagged `@regression` |
| `npm run test:report` | Run the suite and generate current Cucumber and MERV reports |
| `npm run merv:generate` | Generate a fresh MERV report by running the suite |
| `npm run merv:open` | Open the generated MERV report in a local server |

## Reusable data and environment

Route data is stored in `redbus-automation/test-data/search-data.json` and is
not repeated in step definitions. Configure the selected route and target using
environment variables:

```powershell
$env:BASE_URL = "https://www.redbus.in"
$env:TEST_ROUTE = "puneToMumbai"
$env:HEADLESS = "false"
npm run test:smoke
```

See [redbus-automation/README.md](./redbus-automation/README.md) for full
framework details, report locations, and all supported configuration.
If the runner requires an egress proxy, configure `PLAYWRIGHT_PROXY` locally
and as a GitHub Actions repository secret.

Tests only search for routes; they do not submit passenger details or make
bookings or payments.

## Reports and artifacts

- Cucumber HTML and JSON: `redbus-automation/merv-results/`
- MERV report: `redbus-automation/merv-report/`
- Failure screenshots, traces, and videos: corresponding artifact folders
  under `redbus-automation/`

Generated artifacts, dependency folders, and `.env` files are excluded by
`.gitignore`. The GitHub Actions workflow runs smoke and regression scenarios
and uploads reports and failure artifacts.
