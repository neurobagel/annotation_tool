import CategorySelectTable from "~/components/category-select-table.vue";

// Documentation for testing Vue events of components
// https://docs.cypress.io/guides/component-testing/events-vue

// Mocks

const state = {

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
        }
    }
};

// Tests

describe("Table for selecting categories to linking to table columns on the categorization page", () => {

    it("Select each category", () => {

        // 1. Arrange

        // Set up the spy, mount the component, and bind the spy to it
        const onCategorySelectSpy = cy.spy().as("onCategorySelectSpy");
        cy.mount(CategorySelectTable, {

            computed: state.getters,

            listeners: { "category-select": onCategorySelectSpy },

            plugins: ["bootstrap-vue"]
        });

        // Test each row in the category select table
        for ( let index = 0; index < state.getters.categories().length; index++ ) {

            // 2. Act
            cy.get("td")
                .contains(state.getters.categories()[index])
                .click();

            // 3. Assert
            cy.get("@onCategorySelectSpy")
                .should("have.been.calledWith", { category: state.getters.categories()[index] });
        }
    });
});