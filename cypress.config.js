const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '776bmc',
  e2e: {
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
