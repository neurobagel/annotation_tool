// Description of task: user selects the tool group category and paints one column,
// writes name of tool group, groups that column into that tool group by clicking column name and add
// Expected results: Annotation nav and Next page button are enabled

// Import globals
// import "./e2e";

describe("simple-toolgroup-categorization", () => {
    it("Ensures selecting one tool category and linking it to one column followed by toolgroup setup enables navigation", () => {

        // Setup

        // Get past the index page
        cy.passIndex();

        // Act 1

        // Select 'Assessment Tool' category
        cy.get("[data-cy='categorization-table']")
            .contains("Assessment Tool")
            .click();

        // Assert 1 - Nav and next button should not yet be enabled
        cy.get("[data-cy='menu-item-annotation'] a")
            .should("have.class", "disabled");
        cy.get("[data-cy='button-nextpage']")
            .should("have.class", "disabled");

        // Act 2

        // Link the second column in the column select table with the 'Assessment Tool' category
        cy.get("[data-cy='column-linking-table'] tbody > tr")
            .eq(1)
            .click();

        // Assert 2 - Nav and next button should not be enabled
        cy.get("[data-cy='menu-item-annotation'] a")
            .should("have.class", "disabled");
        cy.get("[data-cy='button-nextpage']")
            .should("have.class", "disabled");

        // Act 3

        // Fill in the toolgroup name textbox
        cy.get("[data-cy='tool-name-textbox']")
          .type("Test ToolGroup 1");

        // Select the column in the assessment tool column multi-selectbox
        cy.get("[data-cy='column-multiselect']")
            .select(0);

        // Create the tool group by clicking the 'create' button
        cy.get("[data-cy='create-toolgroup-button']")
            .click();

        // Assert 3 - Toolgroup is present in the tool groups table
        cy.get("[data-cy='toolgroup-table'] tbody")
            .children()
            .should("have.length", 1);

        // Assert 4 - Nav and next button should still be enabled
        cy.get("[data-cy='menu-item-annotation'] a")
            .should("have.class", "disabled");
        cy.get("[data-cy='button-nextpage']")
            .should("have.class", "disabled");
    });
});