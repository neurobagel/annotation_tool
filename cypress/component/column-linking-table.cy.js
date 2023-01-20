// import { stubObject } from "cypress/types/lodash";
import ColumnLinkingTable from "~/components/column-linking-table.vue";

// Documentation for testing Vue events of components
// https://docs.cypress.io/guides/component-testing/events-vue

// Tests

describe("The column-linking-table component", () => {
    // Initialize the mocks
    let store;
    let props;

    beforeEach(() => {
        // Redefine the mocks
        store = {
            commit: () => {},
            getters: {

                categories: () => {

                    return [

                        "Subject ID",
                        "Age",
                        "Sex"
                    ];
                },

                categoryClasses: () => {

                    return {

                        "Subject ID": "category-style-0",
                        "Age": "category-style-1",
                        "Sex": "category-style-2"
                    };
                },

                getColumnNames: () => {

                    return [
                        "participant_id",
                        "age",
                        "sex"
                    ];
                },

                getColumnDescription: () => (columnName) => {
                    return "descriptions help";
                },

                columnToCategoryMap: () => {

                    return {

                        "participant_id": null,
                        "age": null,
                        "sex": null
                    };
                }
            },

            mutations: {
                alterColumnCategoryMap: () => (activeCategory, columnName) => {}
            }
        };

        props = {

            activeCategory: "Subject ID"
        };

    });

    it("correctly displays columns and descriptions", () => {
        cy.mount(ColumnLinkingTable, {

            mocks: {

                $store: store
            },

            computed: store.getters,

            plugins: ["bootstrap-vue"],

            propsData: props
        });

        for ( const columnName of ["participant_id", "age", "sex"] ) {
            cy.get("[data-cy='column-linking-table-table']").contains(columnName).parent().as("targetRow");
            cy.get("@targetRow").contains("descriptions help");
        }

    });
    it("can alter link relation (add/remove) between a column and a category", () => {

        // 0. The first category and column
        const participantIDColumn = store.getters.getColumnNames()[0];
        const subjectIDCategory = store.getters.categories()[0];

        // 1. Arrange - Set up the spy, mount the component, and bind the spy to it
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
        cy.get("@commitSpy").should("have.been.calledWith", "alterColumnCategoryMap", subjectIDCategory, participantIDColumn);
    });
});