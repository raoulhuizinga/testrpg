# TestRPG — Test Automation

This repository contains the automated test suite for [TestRPG](https://testrpg-one.vercel.app), built as part of a test automation assessment for TestCoders.

## Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | End-to-end GUI tests |
| [Vitest](https://vitest.dev/) | API integration tests |

## Prerequisites

Install Playwright browsers:

```bash
pnpm exec playwright install
```

## Running the tests

Both scripts start the development server automatically before running the tests.

### GUI tests (Playwright)

Runs end-to-end tests against the React frontend on `http://localhost:3000`.

```bash
pnpm gui-test
```

### API tests (Vitest)

Runs integration tests against the Express API on `http://localhost:3001`.

```bash
pnpm api-test
```

## Test reports

After a Playwright run, open the HTML report with:

```bash
pnpm exec playwright show-report
```
