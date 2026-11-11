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
     
        cy.visit('/parabank/index.htm')
    }

    /**
     * Executes the login workflow sequence
     * @param {string} username 
     * @param {string} password 
     * @param {boolean} expectFailure - Included for spec matching (Cypress handles network automatically)
     */
    login(username, password, expectFailure = false) {
        
        if (username) this.usernameInput.type(username);
        if (password) this.passwordInput.type(password);
        this.loginButton.click();

    }
}
