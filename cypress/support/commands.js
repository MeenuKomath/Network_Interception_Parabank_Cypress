import { LoginPage } from 'cypress/pages/Loginpage';
import { AccountPage } from 'cypress/pages/Accountpage'; 

const loginPage = new LoginPage();
const accountPage = new AccountPage();


Cypress.Commands.add('parabankTest', (title, activeFixtures = [], testFn) => {
    it(title, () => {
        const fixtures = { loginPage, accountPage };

        if (activeFixtures.includes('interceptLoginRequest')) {
            cy.intercept('POST', '**/parabank/login.html*').as('loginRequest');
        }

        if (activeFixtures.includes('mockAccountOverview')) {
            cy.intercept('GET', '**/services_proxy/bank/customers/*/accounts', {
                fixture: 'mockdata.json'
            }).as('mockAccountOverview');
        }

        if (activeFixtures.includes('abortLoginRequest')) {
            cy.intercept('POST', '**/parabank/login.html*', {
                statusCode: 500,
                body: '<h1>Internal Server Error</h1>'
            }).as('abortLoginRequest');
        }

        testFn(fixtures);
    });
});
