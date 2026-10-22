# RedBus Automation Framework

JavaScript browser automation using Playwright, Cucumber, Gherkin BDD, Page
Objects, and the MERV Cucumber reporter.

## Requirements and setup

- Node.js 24 LTS or later
- npm
- Git

Run from this directory:

```powershell
npm ci
npx playwright install chromium
npm test
```

## Test commands

| Command | Description |
| --- | --- |
| `npm test` | Run the complete Cucumber suite |
| `npm run test:bdd` | Run the complete Cucumber BDD suite |
| `npm run test:smoke` | Run scenarios tagged `@smoke` |
| `npm run test:regression` | Run scenarios tagged `@regression` |
| `npm run test:report` | Run the suite and generate fresh Cucumber and MERV reports |
| `npm run test:playwright` | Run the standalone Playwright test in `test/` |
| `npm run merv:generate` | Run the suite to generate a fresh MERV report |
| `npm run merv:open` | Serve the generated MERV report locally |

`merv:generate` and `test:report` execute the tests because the MERV Cucumber
formatter generates the report from the live Cucumber run; it is not a
post-processing converter.

## Reusable test data and configuration

Routes are stored once in `test-data/search-data.json`. The default route is
`puneToMumbai`. Select another key by setting `TEST_ROUTE` to a key in that
file. If the key is invalid, the test exits with an explicit error.

Useful environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `BASE_URL` | `https://www.redbus.in` | Target website |
| `TEST_ROUTE` | `puneToMumbai` | Key from `test-data/search-data.json` |
| `HEADLESS` | `true` | Set to `false` to display Chromium |
| `NAVIGATION_TIMEOUT_MS` | `60000` | Homepage navigation timeout |
| `PLAYWRIGHT_PROXY` | unset | Optional HTTP(S)/SOCKS proxy URL for browser traffic |
| `RED_BUS_CURL_BRIDGE` | enabled without proxy | Use system curl over HTTP/1.1 for the target site's browser requests; set `false` to disable |

PowerShell example:

```powershell
$env:BASE_URL = "https://www.redbus.in"
$env:TEST_ROUTE = "puneToMumbai"
$env:HEADLESS = "false"
npm run test:smoke
```

The HTTP/1.1 bridge is enabled by default because Chromium's HTTP/2 negotiation
fails in some networks although the site is accessible over HTTP/1.1. It uses
the machine's installed `curl` executable to fetch the target site's real pages
and API responses; optional font requests remain on native browser networking.
Chromium still renders the page and drives all interactions.
Set `RED_BUS_CURL_BRIDGE=false` to use direct browser networking instead. If a
browser proxy is configured in `PLAYWRIGHT_PROXY`, the bridge is disabled by
default so Playwright can use that proxy directly.

Do not commit proxy credentials. For GitHub Actions, store the authorized proxy
URL as the repository Actions secret `PLAYWRIGHT_PROXY`; the workflow passes it
to Playwright without logging or saving it in the repository. The repository
variable `RED_BUS_CURL_BRIDGE` can disable the default bridge.

Tests search for buses only. They do not log in, make a booking, submit
passenger data, or pay.

## Framework layout

```text
features/             Gherkin features
step-definitions/     Cucumber step definitions
test/                 Standalone Playwright specs
pages/                LoginPage, ProductsPage, CartPage, CheckoutPage
support/              Cucumber World and browser hooks
test-data/            Reusable route data
config/               Environment configuration
merv-results/         Cucumber HTML and JSON output
merv-report/          MERV HTML report and run data
screenshots/          Screenshots attached and saved on failure
traces/               Playwright traces saved on failure
videos/               Videos retained on failure
```

## Reports and failure artifacts

Cucumber writes `merv-results/cucumber-report.html` and
`merv-results/cucumber-report.json`. The MERV formatter writes its HTML report
and report data into `merv-report/`. Both output directories are generated and
are excluded from Git. On scenario failure, the `After` hook attaches a
screenshot and preserves the Playwright trace and video.

## GitHub Actions

The workflow runs smoke and regression tags on pushes and pull requests to
`main`, and can be started manually. It installs dependencies and Chromium,
then uploads generated reports and failure artifacts even if tests fail.
`BASE_URL` may be configured as a GitHub repository variable.
