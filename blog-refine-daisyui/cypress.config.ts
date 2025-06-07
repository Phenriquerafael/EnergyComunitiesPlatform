import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
  },
  env: {
    apiUrl: 'http://localhost:4000/api', // URL do backend
  },
  viewportWidth: 1280,
  viewportHeight: 720,
});