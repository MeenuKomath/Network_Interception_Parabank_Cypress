const { defineConfig } = require("cypress");
module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://parabank.parasoft.com',
        setupNodeEvents(on, config) {

            on('task', {
                log(message) {
                    console.log(message);
                    return null;
                },

            })
        }
    }
});
