
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';

Cypress.Commands.add('loginToParaBank', (username, password, expectFailure = false) => {
    const loginPage = new LoginPage();
    loginPage.navigate();
    loginPage.login(username, password, expectFailure);
});

Cypress.Commands.add('setupParaBankIntercept', (type) => {
    if (type === 'interceptLoginRequest') {
        cy.intercept('POST', '**/parabank/login.htm*').as('loginRequest');
    }

    if (type === 'mockAccountOverview') {
        cy.intercept('GET', '**/services_proxy/bank/customers/*/accounts', {
            fixture: 'mockdata.json',
        }).as('mockAccountOverview');
    }

    if (type === 'abortLoginRequest') {
        cy.intercept('POST', '**/parabank/login.htm*', {
            statusCode: 500,
            headers: { 'content-type': 'text/html' },
            body: '<h1>Internal Server Error</h1>',
        }).as('abortLoginRequest');
    }
});
