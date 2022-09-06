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

Cypress.Commands.add("categorizeColumn", (p_category, p_columnName) => {

    // 1. Select the given category in the categorization table
    cy.get("[data-cy='categorization-table']")
        .contains(p_category)
        .click();

    // 2. Link the category to this column in the column linking table
    cy.get("[data-cy='column-linking-table'] tbody > tr > td")
        .contains(p_columnName)
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

        // 2. Check to see if the tool group categorization requirements of a test are met by a dataset
        if ( "toolGroups" in p_testCriteria ) {

            // A. Failure #1: Dataset does not have an 'Assessment Tool' category
            if ( !Object.keys(p_datasetConfig["category_columns"]).includes("Assessment Tool") )
                return false;

            // B. Failure #2: Test tool count requirement is more than the # of tools available in dataset
            const datasetToolCount = p_datasetConfig["category_columns"]["Assessment Tool"].length;
            let testToolCount = 0;
            for ( const [/*groupName*/, columnCount] of p_testCriteria.toolGroups ) {
                testToolCount += columnCount;
            }
            if ( testToolCount > datasetToolCount )
                return false;
        }
    }

    return true;
});

// Calls action in the Nuxt store
Cypress.Commands.add("dispatchToNuxtStore", (p_action, p_data) => {

    // Dispatch action with given data on the Nuxt store
    cy.window().its("$nuxt.$store").then(p_store => {

        p_store.dispatch(p_action, p_data);
    });
});

// Retrieves store value via getters
Cypress.Commands.add("getNuxtStoreValue", (p_storeVariableName) => {

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
                cy.dispatchToNuxtStore("linkColumnWithCategory", {

                    category: category,
                    column: p_dataset["category_columns"][category][index]
                });
            }
        }

        // 2. Create assessment tool groups if given
        if ( "toolGroups" in p_pageData ) {

            const toolGroupData = {};

            // A. For each tool group, create a list of tools from the dataset for each tool group
            for ( let index = 0; index < p_pageData.toolGroups.length; index++ ) {

                const [groupName, columnCount] = p_pageData.toolGroups[index];

                toolGroupData[groupName] = [];
                for ( let index = 0; index < p_dataset["category_columns"]["Assessment Tool"].length; index += columnCount + 1) {

                    toolGroupData[groupName] = p_dataset["category_columns"]["Assessment Tool"].slice(index, index + columnCount);
                }
            }

            // B. Add each tool group to the store
            for ( const groupName in toolGroupData ) {

                cy.dispatchToNuxtStore("createToolGroup", {

                    name: groupName,
                    tools: toolGroupData[groupName]
                });
            }
        }

        // 3. Call page initialization store function for the annotation page
        cy.dispatchToNuxtStore("initializePage", {

            pageName: "annotation",
            enable: true
        });

    } else if ( "download" == p_pageName ) {

        // Load state for download page
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

        cy.dispatchToNuxtStore("saveDataTable", {

            data: dataTable,
            filename: p_dataset.data_table,
            fileType: "tsv"
        });
    });

    // 2. Load data table from file and save it to the Vuex store
    cy.loadDataDictionary(p_dataset.source_folder, p_dataset.data_dictionary).then(dataDictionary => {

        cy.dispatchToNuxtStore("saveDataDictionary", {

            data: dataDictionary,
            filename: p_dataset.data_dictionary,
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