// Description: User selects data table alone
// Expected results: Data table selection enables next page nav

describe("select-datatable", () => {
    it("Ensures selecting participants file enables navigation", () => {

        // Setup
        cy.visit("http://localhost:3000/");

        // Act

        // Select participants file
        cy.get("[data-cy='data-table-selector']")
          .contains("Choose file")
          .click()
          .selectFile("./examples/good/ds003653_participant.tsv");

        // Assert

        // Check to see that categorization nav item and next button are enabled
        cy.get("[data-cy='menu-item-categorization'] a")
          .should("not.have.class", "disabled");
        cy.get("[data-cy='button-nextpage']")
          .should("not.have.class", "disabled");
    });
});