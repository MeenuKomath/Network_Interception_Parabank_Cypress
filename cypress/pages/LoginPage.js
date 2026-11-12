// cypress/pages/LoginPage.js
export class LoginPage {
    get usernameInput() {
        return cy.get('input[name="username"]');
    }

    get passwordInput() {
        return cy.get('input[name="password"]');
    }

    get loginButton() {
        return cy.get('input[value="Log In"]');
    }

    navigate() {
       
        const loginPath = Cypress.expose('loginPath');
        cy.visit(loginPath);
        cy.task('log', '--- Successfully visited the Login page ---');
    }

    /**
     * Executes the login workflow sequence
     * @param {string} username 
     * @param {string} password 
     * @param {boolean} expectFailure 
     */
    login(username, password, expectFailure = false) {
        if (username) this.usernameInput.type(username);
        if (password) this.passwordInput.type(password);
        this.loginButton.click();
    }
}
