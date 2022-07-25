// Description: User selects data dictionary alone
// Expected results: Data dictionary selection does not enable next page nav

describe("select-datadictionary", () => {
    it("Ensures selecting participants file enables navigation", () => {

        // Setup
        cy.visit("http://localhost:3000/");

        // Act

        // Select participants dictionary
        cy.get("[data-cy='data-dictionary-selector']")
          .contains("Choose file")
          .click()
          .selectFile("./examples/good/ds003653_participant.json");

        // Assert

        // Check to see that categorization nav item and next button are enabled
        cy.get("[data-cy='menu-item-categorization'] a")
          .first()
          .should('have.class', 'disabled');
        cy.get("[data-cy='button-nextpage']")
          .should('have.class', 'disabled');
    });
});