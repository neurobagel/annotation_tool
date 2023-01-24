import CategorySelectTable from "~/components/category-select-table.vue";


// Mocks
const computed = {

    getCategoryNames: () => {

        return [

            "Subject ID",
            "Age",
            "Sex",
            "Diagnosis",
            "Assessment Tool"
        ];
    },

    // This is mocked as a computed property but is implemented as a state variable in the store
    colorInfo: () => {

        return {

            categoryClasses: {

                "Subject ID": "category-style-1",
                "Age": "category-style-2",
                "Sex": "category-style-3",
                "Diagnosis": "category-style-4",
                "Assessment Tool": "category-style-5"
            }
        };
    }
};

// Tests

describe("Table for selecting categories to linking to table columns on the categorization page", () => {

    it("Select each category", () => {

        // 1. Arrange

        // Set up the spy, mount the component, and bind the spy to it
        const onCategorySelectSpy = cy.spy().as("onCategorySelectSpy");
        cy.mount(CategorySelectTable, {

            computed: computed,

            listeners: { "category-select": onCategorySelectSpy },

            plugins: ["bootstrap-vue"],

            propsData: { selectedCategory: computed.getCategoryNames()[0] }
        });

        // Test each row in the category select table
        for ( let index = 0; index < computed.getCategoryNames().length; index++ ) {

            // 2. Act
            cy.get("td")
                .contains(computed.getCategoryNames()[index])
                .click();

            // 3. Assert
            cy.get("@onCategorySelectSpy")
                .should("have.been.calledWith", { category: computed.getCategoryNames()[index] });
        }
    });
});