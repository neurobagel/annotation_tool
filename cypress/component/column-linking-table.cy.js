// import { stubObject } from "cypress/types/lodash";
import ColumnLinkingTable from "~/components/column-linking-table.vue";

// Documentation for testing Vue events of components
// https://docs.cypress.io/guides/component-testing/events-vue

// Mocks

const store = {
    commit: () => {},
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
    },

    mutations: {
        alterColumnCategoryMapping: () => (activeCategory, columnName) => {}
    }
};

const props = {

    activeCategory: "Subject ID"
};

// Tests

describe("Tests basic functionality of the table that links categories with data table columns", () => {

    it("Alter link relation (add/remove) between a column and a category", () => {

        // 0. The first category and column
        const participantIDColumn = store.getters.columns()[0].name;
        const subjectIDCategory = store.getters.categories()[0];

        // 1. Arrange - Set up the spy, mount the component, and bind the spy to it
        const onColumnNameClickedSpy = cy.spy().as("onColumnNameClickedSpy");
        cy.spy(store, 'commit').as('commitSpy');
        cy.mount(ColumnLinkingTable, {

            mocks: {

                $store: store
            },

            computed: store.getters,

            plugins: ["bootstrap-vue"],

            propsData: props
        });

        // 2. Action - Link the first column to the current category
        cy.get("[data-cy='column-linking-table-table'] tbody > :nth-child(1) > [aria-colindex='1']")
            .contains(participantIDColumn)
            .click();

        // 3. Assert - Make sure linking mutation is commited to the store
        cy.get("@commitSpy").should("have.been.calledWith", "alterColumnCategoryMapping", subjectIDCategory, participantIDColumn);
    });
});