describe("to annotate an assessment ", () => {


    it("sets up some stuff", () => {
        // Load some data
        cy.visit('/');
        cy.get('[data-cy="data-table-selector"]').get('input').selectFile('cypress/fixtures/examples/good/example.tsv', { force: true });
        cy.get("[data-cy='button-nextpage']").click();

        // Categorize some columns
        const desiredColumnMappings = [
            {
                "column": "participant_id",
                "category": "Subject ID"
            },
            {
                "column": "sex",
                "category": "Sex"
            },
            {
                "column": "group",
                "category": "Diagnosis"
            },
            {
                "column": "stroop",
                "category": "Assessment Tool"
            },
            {
                "column": "iq",
                "category": "Assessment Tool"
            }
        ];
        desiredColumnMappings.forEach(desiredColumnMapping => {
            cy.get("[data-cy='categorization-table']").contains(desiredColumnMapping.category).click();
            cy.get("[data-cy='column-linking-table']").contains(desiredColumnMapping.column).click();
        });
        // Create two tools
        cy.get("[data-cy='toolgroup-select']").type("Wechsler Abbreviated Scale of Intelligence{enter}");
        cy.get("[data-cy='toolgroup-select']").type("Unified Parkinson's Disease Rating Scale{enter}");
        // Map columns to tools
        const desiredColumnToolMappings = [
            {
                "column": "iq",
                "tool": "Wechsler Abbreviated Scale of Intelligence"
            },
            {
                "column": "stroop",
                "tool": "Unified Parkinson's Disease Rating Scale"
            }
        ];
        desiredColumnToolMappings.forEach(desiredColumnToolMapping => {
            cy.get("[data-cy='assessment-tool-table']").contains(desiredColumnToolMapping.tool).click();
            cy.get("[data-cy='assessment-column-table']").contains(desiredColumnToolMapping.column).click();
        });

        // We apparently are unable to use the normal "next page" button here
        // for some reason I don't yet understand. So we can force-route ourselves
        // to the next page here despite the button erroneously not being enabled.
        cy.window().its("$nuxt.$router").then(router => {
            router.push({ path: "/annotation" });
        });
    });
});