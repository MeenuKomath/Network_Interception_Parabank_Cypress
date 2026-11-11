// cypress/pages/Accountpage.js
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
}
