// cypress/support/e2e.js
import 'cypress-mochawesome-reporter/register';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';

beforeEach(() => {
    cy.loginPage = new LoginPage();
    cy.accountPage = new AccountPage();
});
