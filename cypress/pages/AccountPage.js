// cypress/pages/AccountPage.js
export class AccountPage {
    get accountTable() {
        return cy.get('#accountTable');
    }

    get accountRows() {
        return this.accountTable.find('tbody tr').filter(':has(a)');
    }

    get totalRow() {
        return this.accountTable.find('tbody tr').contains('Total').closest('tr');
    }

    /**
     * Verifies a specific account row's details using internal cell locators
     * @param {number} rowIndex 
     * @param {string} accountNumber 
     * @param {string} balance 
     * @param {string} availableAmount 
     */
    verifyAccountRow(rowIndex, accountNumber, balance, availableAmount) {
        this.accountRows.eq(rowIndex).within(() => {
            cy.get('td').eq(0).should('have.text', accountNumber);
            cy.get('td').eq(1).should('have.text', balance);
            cy.get('td').eq(2).should('have.text', availableAmount);
        });
    }

    /**
     * Verifies the Total summary row at the bottom of the accounts table
     * @param {string} expectedTotal 
     */
    verifyTotalRow(expectedTotal) {
        this.totalRow.within(() => {
            cy.get('td').contains('Total').should('be.visible');
            cy.get('td').filter(':contains("$")').should('have.text', expectedTotal);
        });
    }
}
