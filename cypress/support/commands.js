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

// Standard setup functionality for each collection of tests
// NOTE: In the future we will likely want to parametrize this for different
// test setups (i.e. testing across different viewport sizes).
Cypress.Commands.add("appSetup", () => {

    // Standard setup for annotation tool testing

    // A. Set viewport size
    // NOTE: Standard 13-inch laptop screen to start, but this can be expanded
    cy.viewport("macbook-13");
});

Cypress.Commands.add("assertNextPageAccess", (p_pageName, p_enabled) => {

    let chainer = ( p_enabled ) ? "not.have.class" : "have.class";

    cy.get("[data-cy='menu-item-" + p_pageName + "'] a")
        .should(chainer, "disabled");
    cy.get("[data-cy='button-nextpage']")
        .should(chainer, "disabled");
});

Cypress.Commands.add("categorizeColumn", (p_category, p_columnTableRow) => {

    // 1. Select the given category in the categorization table
    cy.get("[data-cy='categorization-table']")
        .contains(p_category)
        .click();

    // 2. Link the category to this column in the column linking table
    cy.get("[data-cy='column-linking-table'] tbody > tr > td")
        .eq(p_columnTableRow)
        .click();
});

// Calls action in the Nuxt store
Cypress.Commands.add("dispatchToNuxtStore", (p_action, p_data) => {

    // Dispatch action with given data on the Nuxt store
    cy.window().its("$nuxt.$store").then(p_store => {

        p_store.dispatch(p_action, p_data);
    });
});

// Load participants json data dictionary
Cypress.Commands.add("loadDataDictionary", (p_sourceDirectory, p_filename) => {

    cy.fixture(p_sourceDirectory + p_filename).then(function(p_fileData) {

        return JSON.stringify(p_fileData);
    }).as("dataDictionary");
});

// Load participants tsv data table into table form
Cypress.Commands.add("loadDataTable", (p_sourceDirectory, p_filename) => {

    cy.fixture(p_sourceDirectory + p_filename).then(function(p_fileData) {

        let dataTable = [];

        // A. Split rows by newlines
        let lines = p_fileData.split("\n");

        // B. Each table row is a list of parts split by tabs
        for ( let index = 0; index < lines.length; index++ ) {

            // I. Skip blank lines
            if ( 0 == lines[index].trim().length ) {
                continue;
            }

            // II. Each table row is a list consisting of parts split by tabs
            dataTable.push([]);
            let lineParts = lines[index].split("\t");
            for ( let index2 = 0; index2 < lineParts.length; index2++ ) {

                if ( lineParts[index2].trim().length > 0 ) {
                    dataTable[index].push(lineParts[index2]);
                }
            }
        }

        return dataTable;
    }).as("dataTable");
});

// Stock data loading function with hardcoded paths (for now)
Cypress.Commands.add("loadTestDataIntoStore", () => {

    // 1. Load data table from file and save it to the Vuex store
    cy.loadDataTable("examples/good/", "ds003653_participant.tsv").then(dataTable => {

        cy.dispatchToNuxtStore("saveDataTable", {

            data: dataTable,
            filename: "ds003653_participant.tsv",
            fileType: "tsv"
        });
    });

    // 2. Load data table from file and save it to the Vuex store
    cy.loadDataDictionary("examples/good/", "ds003653_participant.json").then(dataDictionary => {

        cy.dispatchToNuxtStore("saveDataDictionary", {

            data: dataDictionary,
            filename: "ds003653_participant.json",
            fileType: "json"
        });
    });
});

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