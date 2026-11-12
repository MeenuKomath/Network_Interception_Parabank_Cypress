# ParaBank Network Interception Framework (Cypress & JavaScript)

![Cypress](https://shields.io)
![JavaScript](https://shields.io)
![GitHub Actions](https://shields.io)

An automated end-to-end (E2E) testing framework built with **Cypress (v16+)** and **JavaScript** demonstrating advanced **Network Interception** (`cy.intercept()`) against the [ParaBank Online Banking](https://parasoft.com) demo application. The framework follows the **Page Object Model (POM)** design pattern, supports data mocking via JSON fixtures, logs network payloads to the terminal via Node tasks, and integrates with **GitHub Actions** for continuous testing.

---

## Key Features

* **Live Traffic Spying & Terminal Logging:** Intercepts `POST **/parabank/login.htm*` requests and prints HTTP methods, request/response headers, payloads, and status codes directly to the Node console using `cy.task('log', ...)`.
* **API Response Mocking:** Stubs `GET **/services_proxy/bank/customers/*/accounts` using external JSON fixtures (`mockdata.json`) to validate UI rendering of positive, negative, and zero account balances without relying on backend database state.
* **Network Failure & Error Simulation:** Forces `500 Internal Server Error` responses on login requests to verify application resilience and graceful error handling.
* **Cypress 16+ Security Compliance:** Uses asynchronous `cy.env()` for sensitive credentials (`TEST_USERNAME`, `TEST_PASSWORD`) and `Cypress.expose()` for non-sensitive route paths (`loginPath`).
* **Page Object Model (POM):** Decouples DOM selectors and table row assertions (`LoginPage.js` and `AccountPage.js`) from test specifications.
* **CI/CD Ready:** Configured with a GitHub Actions workflow that injects repository secrets via `CYPRESS_*` environment variables and archives screenshots and videos on test runs.

---

## Project Structure

```text
Parabank_NetworkInterception_Cypress/
├── .github/
│   └── workflows/
│       └── cypress.yml             # GitHub Actions CI/CD pipeline configuration
├── cypress/
│   ├── e2e/
│   │   └── test.spec.cy.js         # Network interception test suite (TC-01 to TC-03)
│   ├── fixtures/
│   │   └── mockdata.json           # Mock JSON payload for Accounts Overview table
│   ├── pages/
│   │   ├── AccountPage.js          # Locators & row verification methods for Accounts Overview
│   │   └── LoginPage.js            # Locators & actions for ParaBank Login page
│   └── support/
│       ├── commands.js             # Custom Cypress commands
│       └── e2e.js                  # Global beforeEach hooks attaching Page Objects to cy
├── cypress.config.js               # Base URL, exposed paths, and cy.task('log') setup
├── cypress.env.json                # Local sensitive credentials (excluded from Git)
└── package.json                    # Project dependencies and scripts
```

---

## Test Scenarios Covered

| Test Case | Intercept Type | Target Endpoint | Validation Objective |
| :--- | :--- | :--- | :--- |
| **TC : 01** | **Spy / Monitor** | `POST **/parabank/login.htm*` | Captures live login traffic, logs request/response headers, method, and status code to the terminal, and verifies dashboard visibility. |
| **TC : 02** | **Stub / Mock** | `GET **/services_proxy/bank/customers/*/accounts` | Replaces live account data with `mockdata.json` and verifies row balances (`-$3310.00`, `$420.45`) and the calculated `Total` (`-$2889.55`). |
| **TC : 03** | **Abort / Fault** | `POST **/parabank/login.htm*` | Injects a `500 Internal Server Error` response and confirms the user stays safely on `login.htm` without crashing. |

---

## Setup & Local Execution

### 1. Prerequisites
* **Node.js** (v20 or v24+ recommended)
* **npm**

### 2. Install Dependencies
Clone the repository and install the required packages:
```bash
git clone https://github.com<your-username>/Network_Interception_Parabank_Cypress.git
cd Network_Interception_Parabank_Cypress
npm ci
```

### 3. Configure Local Credentials
Create a `cypress.env.json` file in the project root (ensure this file is listed in `.gitignore` so credentials are never committed):
```json
{
  "TEST_USERNAME": "john",
  "TEST_PASSWORD": "demo"
}
```

### 4. Run Tests
* **Interactive Mode (Cypress Test Runner):**
  ```bash
  npx cypress open
  ```
* **Headless Mode (CLI with Terminal Logs):**
  ```bash
  npx cypress run --browser chrome
  ```

---

## CI/CD Pipeline (GitHub Actions)

The workflow in `.github/workflows/cypress.yml` triggers automatically on every `push` or `pull_request` to `main` or `master`.

1. Navigate to your GitHub repository **Settings > Secrets and variables > Actions**.
2. Add the following **Repository Secrets**:
   * `TEST_USERNAME`: Your ParaBank test username
   * `TEST_PASSWORD`: Your ParaBank test password
3. GitHub Actions maps these secrets to `CYPRESS_TEST_USERNAME` and `CYPRESS_TEST_PASSWORD`, allowing `cy.env(['TEST_USERNAME', 'TEST_PASSWORD'])` to resolve them securely at runtime.
4. Failure screenshots (`cypress/screenshots`) and execution videos (`cypress/videos`) are automatically uploaded as workflow artifacts.
