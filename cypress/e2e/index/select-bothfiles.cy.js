// Description: User selects data table AND data dictionary
// Expected results: Data dictionary selection does not enable next page nav, but data table selection does

describe("select-bothfiles", () => {
    it("Ensures selecting participants file enables navigation and selecting data dictionary does not", () => {

        // Setup
        cy.visit("http://localhost:3000");

        // Act 1

        // Select participants dictionary
        cy.get("[data-cy='data-dictionary-selector']")
          .contains("Choose file")
          .click()
          .selectFile("./examples/good/ds003653_participant.json");

        // Assert 1

        // Check to see that categorization nav item and next button are enabled
        cy.get("[data-cy='menu-item-categorization'] a")
          .first()
          .should('have.class', 'disabled');
        cy.get("[data-cy='button-nextpage']")
          .should('have.class', 'disabled');

        // Act 2

        // Select participants file
        cy.get("[data-cy='data-table-selector']")
          .contains("Choose file")
          .click()
          .selectFile("./examples/good/ds003653_participant.tsv");

        // Assert 2

        // Check to see that categorization nav item and next button are enabled
        cy.get("[data-cy='menu-item-categorization'] a")
          .should("not.have.class", "disabled");
        cy.get("[data-cy='button-nextpage']")
          .should("not.have.class", "disabled");
    });
});