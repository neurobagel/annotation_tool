// Description of task: user selects one non-tool group category and paints one column
// Expected results: Annotation nav and Next page button are enabled

// Import globals
// import "./e2e";

describe("simple-categorization", () => {
    it("Ensures selecting one non-tool category and linking it to one column enables navigation and selecting data dictionary does not", () => {

        // Setup

        // Get past the index page
        cy.passIndex();

        // Act 1

        // Select subject ID category
        cy.get("[data-cy='categorization-table']")
            .contains("Subject ID")
            .click();

        // Assert 1 - Nav and next button should not yet be enabled
        cy.get("[data-cy='menu-item-annotation'] a")
            .should("have.class", "disabled");
        cy.get("[data-cy='button-nextpage']")
            .should("have.class", "disabled");

        // Act 2

        // Link the first column in the column select table with the subject ID category
        cy.get("[data-cy='column-linking-table'] tbody")
            .first()
            .click();

        // Assert 2 - Nav and next button should be enabled
        // Assert 1
        cy.get("[data-cy='menu-item-annotation'] a")
            .should("not.have.class", "disabled");
        cy.get("[data-cy='button-nextpage']")
            .should("not.have.class", "disabled");

    });
});