import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.{js,ts,jsx,tsx}",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents() {
      // implement node event listeners here if needed
    },
  },
  video: false,
  screenshotOnRunFailure: true,
});
