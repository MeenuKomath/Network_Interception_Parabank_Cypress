describe("Network Interception - ParaBank Application", () => {

    const runParaBankTest = (activeFixtures, testFn) => {
        
        if (activeFixtures.includes('interceptLoginRequest')) {
            cy.intercept('POST', '**/parabank/login.htm*').as('loginRequest');
        }

        if (activeFixtures.includes('mockAccountOverview')) {
            cy.intercept('GET', '**/services_proxy/bank/customers/*/accounts', {
                fixture: 'mockdata.json'
            }).as('mockAccountOverview');
        }

        
        if (activeFixtures.includes('abortLoginRequest')) {
            cy.intercept('POST', '**/parabank/login.htm*', {
                statusCode: 500,
                headers: { 'content-type': 'text/html' },
                body: '<h1>Internal Server Error</h1>'
            }).as('abortLoginRequest');
        }

        
        cy.env(['TEST_USERNAME', 'TEST_PASSWORD']).then((env) => {
            const username = env.TEST_USERNAME || '';
            const password = env.TEST_PASSWORD || '';

           
            testFn({
                loginPage: cy.loginPage,
                accountPage: cy.accountPage,
                username, password
            });
        });
    };

    it('TC : 01 - Intercept and Verification of ParaBank Login', () => {
        runParaBankTest(['interceptLoginRequest'], ({ loginPage, accountPage, username, password }) => {
            loginPage.navigate();
            loginPage.login(username, password);

            cy.wait('@loginRequest').then((interception) => {
                accountPage.accountTable.should('be.visible');

                cy.task('log', '================ INTERCEPTED LOGIN DETAILS ================');
                cy.task('log', `Request URL: ${interception.request.url}`);
                cy.task('log', `Request Method: ${interception.request.method}`);
                cy.task('log', `Request Headers: ${JSON.stringify(interception.request.headers, null, 2)}`);
                cy.task('log', `Request Body: ${interception.request.body}`);

                // Response Details (Safely checks if a response was returned)
                if (interception.response) {
                    cy.task('log', `Response Status Code: ${interception.response.statusCode}`);
                    cy.task('log', `Response Headers: ${JSON.stringify(interception.response.headers, null, 2)}`);
                }
                cy.task('log', '===========================================================');
            });
        });
    });


    it('TC : 02 - Intercept and Mock Accounts Overview Table', () => {
        runParaBankTest(['mockAccountOverview'], ({ loginPage, accountPage, username, password }) => {
            loginPage.navigate();
            loginPage.login(username, password);

            cy.wait('@mockAccountOverview');

            accountPage.accountTable.should('be.visible');

            accountPage.verifyAccountRow(0, '12345', '-$3310.00', '$0.00');
            accountPage.verifyAccountRow(1, '12456', '$420.45', '$420.45');
            accountPage.verifyTotalRow('-$2889.55');

            cy.log('All mock data assertions passed successfully!');
        });
    });


    it('TC : 03 - Abort Interception (Network Failure)', () => {
        runParaBankTest(['abortLoginRequest'], ({ loginPage, username, password }) => {
            loginPage.navigate();
            loginPage.login(username, password, true);

            cy.wait('@abortLoginRequest').then((interception) => {
                expect(interception.response.statusCode).to.eq(500);
            });

            cy.url().should('include', 'login.htm');
        });
    });
});
