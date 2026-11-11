import { LoginPage } from '../pages/Loginpage';
import { AccountPage } from '../pages/Accountpage';

// Instantiate objects once globally
const loginPageInstance = new LoginPage();
const accountPageInstance = new AccountPage();

// Attach objects directly to the chainable cy runtime execution layer
beforeEach(() => {
    cy.loginPage = loginPageInstance;
    cy.accountPage = accountPageInstance;
});
