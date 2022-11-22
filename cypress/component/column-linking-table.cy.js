// import { stubObject } from "cypress/types/lodash";
import ColumnLinkingTable from "~/components/column-linking-table.vue";

// Documentation for testing Vue events of components
// https://docs.cypress.io/guides/component-testing/events-vue

// Mocks

const store = {

    actions: {

        dispatch: (p_actionName, p_payload) => {}
    },

    getters: {

        categories: () => {

            return [

                "Subject ID",
                "Age",
                "Sex",
                "Diagnosis",
                "Assessment Tool"
            ];
        },

        categoryClasses: () => {

            return {

                "Subject ID": "category-style-0",
                "Age": "category-style-1",
                "Sex": "category-style-2",
                "Diagnosis": "category-style-3",
                "Assessment Tool": "category-style-4"
            };
        },

        columns: () => {

            return [

                { name: "participant_id", description: "" },
                { name: "age", description: "age of the participant" },
                { name: "sex", description: "sex of the participant as reported by the participant" },
                { name: "group", description: "diagnostic status determined by the study clinician at baseline" },
                { name: "group_dx", description: "specific diagnosis determined by the study clinician at baseline" },
                { name: "number_comorbid_dx", description: "a number of diagnoses comorbid with UD (e.g., GAD, PTSD)" },
                { name: "medload", description: "reflects the number of dosage of psychotropic medications taken by participants. Higher numbers correspond to more medications and/or higher medication dosage " },
                { name: "iq", description: "IQ derived based on the NART assessment." },
                { name: "session", description: "scanning session" }
            ];
        },

        columnToCategoryMap: () => {

            return {

                "participant_id": null,
                "age": null,
                "sex": null,
                "group": null,
                "group_dx": null,
                "number_comorbid_dx": null,
                "medload": null,
                "iq": null,
                "session": null
            };
        }
    }
};

const props = {

    selectedCategory: "Subject ID"
};

// Tests

describe("Tests basic functionality of the table that links categories with data table columns", () => {

    it("Alter link relation (add/remove) between a column and a category", () => {

        // 0. The first category and column
        const participantIDColumn = store.getters.columns()[0].name;
        const subjectIDCategory = store.getters.categories()[0];

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
            .contains(participantIDColumn)
            .click();

        // 3. Assert

        // A. Make sure linking action is dispatched to the store
        cy.get("@dispatchSpy").should("have.been.calledWith",

            "alterColumnCategoryRelation",
            { category: subjectIDCategory, column: participantIDColumn  }
        );

        // B. Make sure the column linking component emitted the correct column data
        cy.get("@onColumnNameClickedSpy").should("have.been.calledWith", {

            category: subjectIDCategory,
            column: participantIDColumn
        });
    });
});