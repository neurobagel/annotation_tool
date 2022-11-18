import ColumnLinkingTable from "~/components/column-linking-table.vue";

// Documentation for testing Vue events of components
// https://docs.cypress.io/guides/component-testing/events-vue

// Mocks

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

    actions: {

        dispatch: (p_actionName, p_payload) => { }
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

// Tests

describe("Tests basic functionality of the table that links categories with data table columns", () => {

    it("Link one column from the currently selected category", () => {

        // 1. Arrange - Set up the spy, mount the component, and bind the spy to it
        const onColumnNameClickedSpy = cy.spy().as("onColumnNameClickedSpy");
        cy.spy(store.actions, "dispatch").as("dispatchSpy");
        cy.mount(ColumnLinkingTable, {

            mocks: {

                $store: store.actions
            },

            computed: store.getters,

            listeners: {

                "column-name-clicked": onColumnNameClickedSpy
            },

            plugins: ["bootstrap-vue"],

            propsData: props
        });

        // 2. Action: Link the first column to the current category
        cy.get("[data-cy='column-linking-table-table'] tbody > :nth-child(1) > [aria-colindex='1']")
            .contains(store.state.dataTable.columns[0])
            .click()
            .then(() => {

                // This mimics the 'addColumnCategorization' mutation in the store
                store.state.columnToCategoryMap[store.state.dataTable.columns[0]] = store.state.categories[0];
            });

        // 3. Assert

        // A. Make sure linking action is dispatched to the store
        cy.get("@dispatchSpy").should("have.been.calledWith",

            "linkColumnWithCategory",
            { column: store.state.dataTable.columns[0], category: store.state.categories[0] }
        );

        // B. Make sure the column linking component emitted the correct column data
        cy.get("@onColumnNameClickedSpy").should("have.been.calledWith", {

            column: store.state.dataTable.columns[0]
        });
    });

    it("Unlink one column from the currently selected category", () => {

        // 1. Arrange

        // A. Make it as if the first column and first category have been linked
        store.state.columnToCategoryMap[store.state.dataTable.columns[0]] = store.state.categories[0];

        // B. Set up the spy, mount the component, and bind the spy to it
        const onColumnNameClickedSpy = cy.spy().as("onColumnNameClickedSpy");
        cy.spy(store.actions, "dispatch").as("dispatchSpy");
        cy.mount(ColumnLinkingTable, {

            mocks: {

                $store: store.actions
            },

            computed: store.getters,

            listeners: {

                "column-name-clicked": onColumnNameClickedSpy
            },

            plugins: ["bootstrap-vue"],

            propsData: props
        });

        // 2. Action: Unlink the first column to the current category
        cy.get("[data-cy='column-linking-table-table'] tbody > :nth-child(1) > [aria-colindex='1']")
            .contains(store.state.dataTable.columns[0])
            .click()
            .then(() => {

                // This mimics the 'removeColumnCategorization' mutation in the store
                store.state.columnToCategoryMap[store.state.dataTable.columns[0]] = null;
            });

        // 3. Assert

        // A. Make sure linking action is dispatched to the store
        cy.get("@dispatchSpy").should("have.been.calledWith",

            "unlinkColumnFromCategory",
            { column: store.state.dataTable.columns[0] }
        );

        // B. Make sure the column linking component emitted the correct column data
        cy.get("@onColumnNameClickedSpy").should("have.been.calledWith", {

            column: store.state.dataTable.columns[0]
        });
    });
});