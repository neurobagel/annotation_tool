import annotExplanation from "~/components/annot-explanation";

const props = { activeCategory: "Age" };
let state, store;

describe("explanation", () => {

    // Setup
    beforeEach(() => {

        state = {

            categories: {

                "Age": {

                    explanation: "Age explanation"
                }
            }
        };
        store = {

            getters: {

                getExplanation: () => (p_category) => {

                    return ( "explanation" in state.categories[p_category] ) ?
                        state.categories[p_category].explanation : null;
                }
            },
            state: state
        };

    });

    it("Checks the content of the explanation", () => {

        // Act
        cy.mount(annotExplanation, {

            computed: store.getters,
            plugins: ["bootstrap-vue"],
            propsData: props,
            mocks: { $store: store }
        });

        // Assert
        cy.get(".card-body").should("be.visible");
        cy.get(".card-body").should("contain", "Age explanation");
    });

    it("Displays default when no explanation provided", () => {

        // Setup
        state.categories["Age"] = {};

        // Act
        cy.mount(annotExplanation, {

            computed: store.getters,
            plugins: ["bootstrap-vue"],
            propsData: props,
            mocks: { $store: store }
        });

        // Assert
        cy.get(".card-body").contains("No category/explanation has been provided.");
    });

    it("Displays expected explanation text", () => {

        // Act
        cy.mount(annotExplanation, {

            computed: store.getters,
            plugins: ["bootstrap-vue"],
            propsData: props,
            mocks: { $store: store }
        });

        // Assert
        cy.get(".card-body").contains("Age explanation");
    });
});
