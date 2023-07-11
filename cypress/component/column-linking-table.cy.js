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

                getCategoryNames: () => {

                    return [

                        "Subject ID",
                        "Age",
                        "Sex",
                        "Diagnosis",
                        "Assessment Tool"
                    ];
                },

                getColumnNames: () => {

                    return [

                        "participant_id",
                        "age",
                        "sex"
                    ];
                },

                getColumnDescription: () => (p_columnName) => {

                    return "descriptions help";
                }
            },

            mutations: {

                alterColumnCategoryMapping: () => ({category, columnName}) => {

                    if ( null === store.state.columnToCategoryMap[columnName] ) {

                        store.state.columnToCategoryMap[columnName] = category;
                    } else {

                        store.state.columnToCategoryMap[columnName] = null;
                    }
                }
            },

            state: {

                colorInfo: {

                    categoryClasses: {

                        "Subject ID": "category-style-1",
                        "Age": "category-style-2",
                        "Sex": "category-style-3",
                        "Diagnosis": "category-style-4",
                        "Assessment Tool": "category-style-5"
                    }
                },

                columnToCategoryMap: {

                    "participant_id": null,
                    "age": null,
                    "sex": null
                }
            }
        };

        props = {

            selectedCategory: "Subject ID"
        };

    });

    it("Correctly displays columns and descriptions", () => {

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

    it("Can alter link relation (add/remove) between a column and a category", () => {

        // 0. The first category and column
        const participantIDColumn = store.getters.getColumnNames()[0];
        const subjectIDCategory = store.getters.getCategoryNames()[0];

        // 1. Arrange - Set up the spy, mount the component, and bind the spy to it
        cy.spy(store, "commit").as("commitSpy");
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

        // 3. Assert - Make sure linking mutation is committed to the store
        cy.get("@commitSpy").should("have.been.calledWith", "alterColumnCategoryMapping", { category: subjectIDCategory, columnName: participantIDColumn });
    });

    it("Altering the columnToCategoryMap restyles a table row to reflect current column categorization", () => {

        // 0. The first category and column
        const participantIDColumn = store.getters.getColumnNames()[0];
        const subjectIDCategory = store.getters.getCategoryNames()[0];

        // 1. Arrange - Mount the component
        cy.mount(ColumnLinkingTable, {

            computed: store.getters,
            mocks: { $store: store },
            plugins: ["bootstrap-vue"],
            propsData: props
        });

        cy.get("[data-cy='column-linking-table-table'] tbody > :nth-child(1) > [aria-colindex='1']")
            .contains(participantIDColumn)
            .parent()
            .as("tableRow");

        // 2. Act and Assert

        cy.get("@tableRow")
            .invoke("css", "background-color")
            .then((p_oldBackgroundColor) => {

                // A. Categorize the first data table column with the first category
                store.mutations.alterColumnCategoryMapping(store.state)({category: subjectIDCategory, columnName: participantIDColumn});

                // B. Check to see if the color of the first row in the column linking
                // table corresponding to the first data table column has changed
                cy.get("@tableRow")
                    .invoke("css", "background-color")
                    .should("not.equal", p_oldBackgroundColor)
                    .then(() => {

                        // C. Uncategorize the first data table column
                        store.mutations.alterColumnCategoryMapping(store.state)({category: subjectIDCategory, columnName: participantIDColumn});

                        // D. Check to see if the color of the first row in the column linking has gone back to default
                        cy.get("@tableRow")
                            .invoke("css", "background-color")
                            .should("equal", p_oldBackgroundColor);
                });
            });
    });
});