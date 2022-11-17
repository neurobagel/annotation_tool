import ColumnLinkingTable from "~/components/column-linking-table.vue";

// Documentation for testing Vue events of components
// https://docs.cypress.io/guides/component-testing/events-vue

const store = {

    state: {

        categories: [

            "Subject ID",
            "Age",
            "Sex",
            "Diagnosis",
            "Assessment Tool"
        ],

        categoryClasses: {

            "Subject ID": "category-style-0",
            "Age": "category-style-1",
            "Sex": "category-style-2",
            "Diagnosis": "category-style-3",
            "Assessment Tool": "category-style-4"
        },

        columnToCategoryMap: {

            "participant_id": null,
            "age": null,
            "sex": null,
            "group": null,
            "group_dx": null,
            "number_comorbid_dx": null,
            "medload": null,
            "iq": null,
            "session": null
        },

        dataDictionary: {

            original: {

                "age": { "Description": "age of the participant" },
                "sex": { "Description": "sex of the participant as reported by the participant" },
                "group": { "Description": "diagnostic status determined by the study clinician at baseline" },
                "group_dx": { "Description": "specific diagnosis determined by the study clinician at baseline" },
                "number_comorbid_dx": { "Description": "a number of diagnoses comorbid with UD (e.g., GAD, PTSD)" },
                "medload": { "Description": "reflects the number of dosage of psychotropic medications taken by participants. Higher numbers correspond to more medications and/or higher medication dosage " },
                "iq": { "Description": "IQ derived based on the NART assessment." },
                "session": { "Description": "scanning session" }
            }
        },

        dataTable: {

            columns: [

                "participant_id",
                "age",
                "sex",
                "group",
                "group_dx",
                "number_comorbid_dx",
                "medload",
                "iq",
                "session"
            ],

            original: [{

                "participant_id": "",
                "age": "",
                "sex": "",
                "group": "",
                "group_dx": "",
                "number_comorbid_dx": "",
                "medload": "",
                "iq": "",
                "session": ""
            }]
        },

        toolColorPalette: {

            color1: "category-style-0",
            color2: "category-style-1",
            color3: "category-style-2",
            color4: "category-style-3",
            color5: "category-style-4",
            colorDefault: "category-style-default"
        }
    },

    getters: {}
};

store.getters = {

    categories: () => store.state.categories,
    categoryClasses: () => store.state.categoryClasses,
    columnToCategoryMap: () => store.state.columnToCategoryMap,
    dataDictionary: () => store.state.dataDictionary,
    dataTable: () => store.state.dataTable
};

const props = {

    selectedCategory: "Subject ID"
};


describe("Tests basic functionality of the table that links categories with data table columns", () => {

    // setupStore();

    it("Link and unlink one column from the currently selected category", () => {

        console.log(JSON.stringify(store.state));

        // 1. Arrange - Set up the spy, mount the component, and bind the spy to it
        const onColumnNameSelectedSpy = cy.spy().as("onColumnNameSelectedSpy");
        cy.mount(ColumnLinkingTable, {

            computed: store.getters,

            listeners: {

                "column-name-selected": onColumnNameSelectedSpy
            },

            plugins: ["bootstrap-vue"],

            propsData: props
        });

        // 2. Action: Link the first column to the current category
        cy.get("[data-cy='column-linking-table-table'] tbody > :nth-child(1) > [aria-colindex='1']")
            .contains(store.state.dataTable.columns[0])
            .click();

        // Link the first column to the first category
        // This mimics the 'addColumnCategorization' mutation in the store
        store.state.columnToCategoryMap[store.state.dataTable.columns[0]] = store.state.categories[0];

        // 3. Assert

        // A. Class of table row matches first color class
        cy.get("[data-cy='column-linking-table-table'] tbody > :nth-child(1)")
            .should("have.class", store.state.toolColorPalette.color1);

        // B. Make sure the column linking component emitted the correct column data
        cy.get("@onColumnNameSelectedSpy").should(
            "have.been.calledWith",
            { column: store.state.dataTable.columns[0] });
    });
});