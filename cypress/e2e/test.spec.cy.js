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

            cy.wait('@loginRequest');
            accountPage.accountTable.should('be.visible');
        });
    });

    it('TC : 02 - Intercept and Mock Accounts Overview Table', () => {

        runParaBankTest(['mockAccountOverview'], ({ loginPage, accountPage, username, password }) => {
            loginPage.navigate();
            loginPage.login(username, password);

            cy.wait('@mockAccountOverview');
            accountPage.accountTable.should('be.visible');

            // ─── Assert Row 1 Content Natively ───
            accountPage.accountRows.eq(0).within(() => {
                cy.get('td').eq(0).should('have.text', '12345');
                cy.get('td').eq(1).should('have.text', '-$3310.00');
                cy.get('td').eq(2).should('have.text', '$0.00');
            });

            // ─── Assert Row 2 Content Natively ───
            accountPage.accountRows.eq(1).within(() => {
                cy.get('td').eq(0).should('have.text', '12456');
                cy.get('td').eq(1).should('have.text', '$420.45');
                cy.get('td').eq(2).should('have.text', '$420.45');
            });

            // ─── Assert Total Row Summary Content Natively ───
            accountPage.totalRow.within(() => {
                cy.get('td').contains('Total').should('be.visible');
                cy.get('td').filter(':contains("$")').should('have.text', '-$2889.55');
            });

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
