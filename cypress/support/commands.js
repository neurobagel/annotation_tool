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

Cypress.Commands.add("assertButtonStatus", (p_buttonName, p_enabled) => {

    let chainer = ( p_enabled ) ? "not.have.class" : "have.class";

    cy.get("[data-cy='" + p_buttonName + "']")
        .should(chainer, "disabled");
});

Cypress.Commands.add("assertNextPageAccess", (p_pageName, p_enabled) => {

    let chainer = ( p_enabled ) ? "not.have.class" : "have.class";

    cy.get("[data-cy='menu-item-" + p_pageName + "'] a")
        .should(chainer, "disabled");

    cy.get("[data-cy='button-nextpage']")
        .should(chainer, "disabled");
});

Cypress.Commands.add("categorizeColumn", (p_category, p_column) => {

    // 1. Select the given category in the categorization table
    cy.get("[data-cy='categorization-table']")
        .contains(p_category)
        .click();

    // 2. Link the category to this column in the column linking table
    cy.get("[data-cy='column-linking-table'] tbody > tr > td")
        .contains(p_column)
        .click();
});

Cypress.Commands.add("datasetMeetsTestCriteria", (p_pageName, p_datasetConfig, p_testCriteria) => {

    if ( "categorization" === p_pageName ) {

        // 1. Check to see if the categorization requirements of a test are met by a dataset
        for ( const [category, columnCount] of p_testCriteria.categories ) {

            // A. Failure #1: A test category is missing from the dataset category to column map
            if ( !Object.keys(p_datasetConfig["category_columns"]).includes(category) )
                return false;
            // B. Failure #2: The number of columns in dataset config does not meet the minimum required for the test
            else if ( columnCount > p_datasetConfig["category_columns"][category].length )
                return false;
        }
    }
    else if ( "annotation" === p_pageName ) {

        // 1. Check to see if the categorization requirements of a test are met by a dataset
        for ( const [category, columnCount] of p_testCriteria.categories ) {

            // A. Failure #1: A test category is missing from the dataset category to column map
            if ( !Object.keys(p_datasetConfig["category_columns"]).includes(category) )
                return false;
            // B. Failure #2: The number of columns in dataset config does not meet the minimum required for the test
            else if ( columnCount > p_datasetConfig["category_columns"][category].length )
                return false;
        }
    }

    return true;
});

// Calls mutation in the Nuxt store
Cypress.Commands.add("commitToVuexStore", (p_mutation, p_data) => {

    // Commit mutation with given data on the Nuxt store
    cy.window().its("$nuxt.$store").then(p_store => {

        p_store.commit(p_mutation, p_data);
    });
});

// Calls action in the Nuxt store
Cypress.Commands.add("dispatchToVuexStore", (p_action, p_data) => {

    // Dispatch action with given data on the Nuxt store
    cy.window().its("$nuxt.$store").then(p_store => {

        p_store.dispatch(p_action, p_data);
    });
});

// Retrieves store value via getters
Cypress.Commands.add("getVuexStoreValue", (p_storeVariableName) => {

    return cy.window().its("$nuxt.$store.getters." + p_storeVariableName);
});

// Takes given data and executes the logic needed to programmatically load state
// for the given page
Cypress.Commands.add("loadAppState", (p_pageName, p_dataset, p_pageData) => {

    if ( "categorization" == p_pageName ) {

        // Load state for categorization page

    } else if ( "annotation" == p_pageName ) {

        // NOTE: Modeled off of code from 'tableClick' in categorization.vue

        // 1. Link all given category column pairs and initialize
        for ( const [category, columnCount] of p_pageData.categories ) {

            for ( let index = 0; index < columnCount; index++ ) {

                // A. Link the column to this category
                cy.commitToVuexStore("alterColumnCategoryMapping", {

                    category: category,
                    columnName: p_dataset["category_columns"][category][index]
                });
            }
        }
    } else if ( "download" == p_pageName ) {

        // Load state for download page

        // 1. Link all given category column pairs and initialize
        for ( const [category, columnCount] of p_pageData.categories ) {

            for ( let index = 0; index < columnCount; index++ ) {

                // A. Link the column to this category
                cy.commitToVuexStore("alterColumnCategoryMapping", {

                    category: category,
                    columnName: p_dataset["category_columns"][category][index]
                });
            }
        }

        // 2. Create annotations for each categorized column

        // A. Age column annotations
        cy.commitToVuexStore("setHeuristic", {

            columnName: "age",
            heuristic: "bounded"
        });
        cy.commitToVuexStore("changeMissingStatus", {
            column: "age",
            markAsMissing: true,
            value: " "
        });

        // B. Sex column annotations
        cy.commitToVuexStore("selectCategoricalOption", {

            columnName: "sex",
            optionValue: "bids:male",
            rawValue: "M"
        });
        cy.commitToVuexStore("selectCategoricalOption", {

            columnName: "sex",
            optionValue: "bids:female",
            rawValue: "F"
        });
        cy.commitToVuexStore("changeMissingStatus", {
            column: "sex",
            markAsMissing: true,
            value: "N/A"
        });
    }
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

// Load data table and data dictionary given dataset config (See 'fixtures/test')
Cypress.Commands.add("loadTestDataIntoStore", (p_dataset) => {

    // 1. Load data table from file and save it to the Vuex store
    cy.loadDataTable(p_dataset.source_folder, p_dataset.data_table).then(dataTable => {

        cy.dispatchToVuexStore("processDataTable", {

            data: dataTable,
            filename: p_dataset.data_table
        });

        // 2. Load data table from file and save it to the Vuex store
        cy.loadDataDictionary(p_dataset.source_folder, p_dataset.data_dictionary).then(dataDictionary => {

            cy.dispatchToVuexStore("processDataDictionary", {

                data: dataDictionary,
                filename: p_dataset.data_dictionary
            });
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