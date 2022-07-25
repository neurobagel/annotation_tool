// Description of task: user selects multiple non-tool group category and paints multiple columns
// Expected results: Annotation nav and Next page button are enabled

describe("multiple-categorizaiton", () => {
    it("Ensures selecting participants file enables navigation and selecting data dictionary does not", () => {

        // Setup

        // Get past the index page
        cy.passIndex();

        // Act 1

        // Select 'Subject ID' category
        cy.get("[data-cy='categorization-table']")
            .contains("Subject ID")
            .click();

        // Assert 1 - Nav and next button should not yet be enabled
        cy.get("[data-cy='menu-item-annotation'] a")
            .should("have.class", "disabled");
        cy.get("[data-cy='button-nextpage']")
            .should("have.class", "disabled");

        // Act 2

        // Link the first column in the column select table with the 'Subject ID' category
        cy.get("[data-cy='column-linking-table'] tbody > tr")
            .eq(1)
            .click();

        // Assert 2 - Nav and next button should be enabled
        cy.get("[data-cy='menu-item-annotation'] a")
            .should("not.have.class", "disabled");
        cy.get("[data-cy='button-nextpage']")
            .should("not.have.class", "disabled");

        // Act 3

        // Select 'Diagnosis' category
        cy.get("[data-cy='categorization-table']")
            .contains("Diagnosis")
            .click();

        // Link the second column in the column select table with the 'Diagnosis' category
        cy.get("[data-cy='column-linking-table'] tbody > tr")
            .eq(0)
            .click();

        // Assert 3 - Nav and next button should *still* be enabled
        cy.get("[data-cy='menu-item-annotation'] a")
            .should("not.have.class", "disabled");
        cy.get("[data-cy='button-nextpage']")
            .should("not.have.class", "disabled");
    });
});