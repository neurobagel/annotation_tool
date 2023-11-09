describe("On My homepage", () => {
    it("I can upload some data", () => {
        cy.visit('/');
        // Before I load anything, I have a little notification that my preview will
        // appear once I upload a table
        // Load a table
        cy.get('[data-cy="data-table-selector"]').get('input').selectFile('cypress/fixtures/examples/good/example_synthetic.tsv', { force: true });

        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-cy="data-dictionary-selector"] > .row > form > .file-selector-button').click();
        cy.get('[data-cy="data-dictionary-selector"] > .row > form > .file-selector-button > input').selectFile('cypress/fixtures/examples/good/example_synthetic_participants.json', { force: true });
        /* ==== End Cypress Studio ==== */
    });
});