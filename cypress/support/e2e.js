// cypress/support/e2e.js

// Change 'pages' to 'Pages' to satisfy the Linux runner casing requirements
import { LoginPage } from '../Pages/Loginpage';
import { AccountPage } from '../Pages/Accountpage';

const loginPageInstance = new LoginPage();
const accountPageInstance = new AccountPage();

beforeEach(() => {
    cy.loginPage = loginPageInstance;
    cy.accountPage = accountPageInstance;
});
