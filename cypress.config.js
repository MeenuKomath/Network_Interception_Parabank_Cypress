const { defineConfig } = require("cypress");
const fs = require("fs");

module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://parabank.parasoft.com',
        expose: {
            loginPath: '/parabank/index.htm'
        },

        // Video Configuration
        video: true,
        videoCompression: 32,
        videosFolder: 'cypress/videos',

        // HTML Reporter Configuration
        reporter: 'cypress-mochawesome-reporter',
        reporterOptions: {
            reportDir: 'cypress/reports/html',
            charts: true,
            reportPageTitle: 'ParaBank Network Interception Report',
            embeddedScreenshots: true,
            inlineAssets: true,
            saveJson: true,
            overwrite: false,
            html: false,
            json: true
        },

        setupNodeEvents(on, config) {
            // 1. Register Mochawesome HTML Report Plugin
            require('cypress-mochawesome-reporter/plugin')(on);

            // 2. Terminal Logger Task
            on('task', {
                log(message) {
                    console.log(message);
                    return null;
                },
            });

            // 3. Keep Videos Only on Failed Tests
            on('after:spec', (spec, results) => {
                if (results && results.video) {
                    const failures = results.tests.some((test) =>
                        test.attempts.some((attempt) => attempt.state === 'failed')
                    );
                    if (!failures) {
                        fs.unlinkSync(results.video);
                    }
                }
            });
        }
    }
});
