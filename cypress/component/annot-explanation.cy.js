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

    it("Starts collapsed", () => {

        // Act
        cy.mount(annotExplanation, {

            computed: store.getters,
            plugins: ["bootstrap-vue"],
            propsData: props,
            mocks: { $store: store }
        });

        // Assert
        cy.get(".card-body").should("be.hidden");
    });

    it("Expands when clicked and collapsed when clicked again", () => {

        // Act
        cy.mount(annotExplanation, {

            computed: store.getters,
            plugins: ["bootstrap-vue"],
            propsData: props,
            mocks: { $store: store }
        });
        cy.get(".btn").click();

        // Assert
        cy.get(".card-body").should("be.visible");

        // Act
        cy.get(".btn").click();

        // Assert
        cy.get(".card-body").should("not.be.visible");
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
