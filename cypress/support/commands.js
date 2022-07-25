// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Go to the next page by clicking the next page button
Cypress.Commands.add("nextPageByButton", () => {

    // Click the next page button to proceed to the next page
    cy.get("[data-cy='button-nextpage']")
        .click();   
});

// Go to the next page by clicking the nav bar link
Cypress.Commands.add("nextPageByNav", (p_navItemName) => {
    
    // Click the corresponding nav item to proceed to the next page
    cy.get(`[data-cy='menu-item-${p_navItemName}'] a`)
        .click();
});

// Go through index page and select participants tsv and json dictionary files, advance to categorization page
Cypress.Commands.add("passIndex", () => {

    // 1. Go to home page
    cy.visit(".");

    // 2. Select participants file
    cy.get("[data-cy='data-table-selector']")
        .contains("Choose file")
        .click()
        .selectFile("./examples/good/ds003653_participant.tsv");

    // 3. Select participants dictionary
    cy.get("[data-cy='data-dictionary-selector']")
        .contains("Choose file")
        .click()
        .selectFile("./examples/good/ds003653_participant.json");
    
    // 4. Click the next page button to proceed to the categorization page
    cy.nextPageByButton();
});

// Go through categorization page, selecting subject ID category and linking it to first column, advance to annotation page
Cypress.Commands.add("passCategorization", () => {

    // 1. Pass the home page
    cy.passIndex();

    // 2. Select subject ID category and link it to the participant ID column
    categorizeColumn("Subject ID", 0);

    // 3. Select age category and link it to the age column
    categorizeColumn("Age", 1);
        
    // 4. Select sex category and link it to the sex column
    categorizeColumn("Sex", 2);

    // 5. Select diagnosis category and link it to a diagnosis column
    categorizeColumn("Diagnosis", 4);

    // 6. Select 'Assessment Tool' category and link it to the IQ column
    categorizeColumn("Assessment Tool", 7);
        
    // 7. Create a tool group label, select the column, and create a new tool group

    // Fill in the toolgroup name textbox
    cy.get("[data-cy='tool-name-textbox']")
        .type("Test ToolGroup 1");
        
    // Select the column in the assessment tool column multi-selectbox
    cy.get("[data-cy='column-multiselect']")
        .select(0);

    // Create the tool group by clicking the 'create' button
    cy.get("[data-cy='create-toolgroup-button']")
        .click();

    // 4. Click the next page button to proceed to the annotation page
    cy.nextPageByButton();      
});

function categorizeColumn(p_category, p_columnTableRow) {
    
    // 1. Select the given category in the categorization table
    cy.get("[data-cy='categorization-table']")
        .contains(p_category)
        .click();

    // 2. Link the category to this column in the column linking table
    cy.get("[data-cy='column-linking-table'] tbody > tr")
        .eq(p_columnTableRow)
        .click();    
}