# RedBus Automation Framework

Production-style browser automation using Node.js, JavaScript, Playwright,
Cucumber, Gherkin BDD, Page Objects, and MERV reports.

## Requirements

- Node.js 24 LTS or later
- npm
- Git

## Install and run

From this directory:

```powershell
npm ci
npx playwright install chromium
npm test
```

Run the tag subsets:

```powershell
npm run test:smoke
npm run test:regression
```

Set a different target site or launch a headed browser:

```powershell
$env:BASE_URL = "https://www.redbus.in"
$env:HEADLESS = "false"
npm test
```

The default `BASE_URL` is `https://www.redbus.in`. Tests search for buses only;
they do not log in, make a booking, submit passenger data, or pay.

## Framework structure

```text
features/             Gherkin feature files
step-definitions/     Cucumber steps
pages/                Page Object Model
support/              World, browser hooks, and runtime configuration
test-data/            Reusable scenarios and test data
config/               Environment configuration
reports/              MERV HTML/JSON reports
screenshots/          Screenshots captured on scenario failure
traces/               Playwright traces captured on scenario failure
videos/               Videos retained for failed scenarios
.github/workflows/    GitHub Actions CI
```

## Reports and failure artifacts

The `merv-client-cucumber` formatter writes the MERV report under
`reports/merv/`. The Cucumber JSON formatter also writes
`reports/cucumber-report.json`. Open the MERV `index.html` report after a run.
The `After` hook attaches and saves a screenshot on failure, and preserves the
Playwright trace and video for diagnosis. GitHub Actions uploads reports and
artifacts even when tests fail.

## GitHub Actions

The workflow runs on pushes and pull requests to `main`, and supports manual
dispatch. It installs Node.js, npm dependencies, Chromium, runs smoke and
regression scenarios, and uploads the generated reports and failure artifacts.
