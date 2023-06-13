import annotCategorical from "~/components/annot-categorical.vue";


let store;

const props = {

    activeCategory: "category1"
};


describe("Categorical annotation", () => {

    beforeEach(() => {

        store = {

            commit: (p_mutationName, p_argument) => { store.mutations[p_mutationName](p_argument); },

            getters: {

                getCategoricalOptions: () => (p_column) => {

                    return [

                        { label: "option_0", identifier: "https://example.org/option_0"},
                        { label: "option_1", identifier: "https://example.org/option_1"},
                        { label: "option_2", identifier: "https://example.org/option_2"},
                        { label: "option_3", identifier: "https://example.org/option_3"}
                    ];
                },

                getSelectedCategoricalOption: () => (p_column, p_rawValue) => {

                    return "https://example.org/" + p_rawValue;
                },

                getUniqueValues: () => (p_activeCategory) => {

                    return {

                        column1: ["PD", "HC"],
                        column2: ["", "oups"]
                    };
                },

                getValueDescription: () => (p_column, p_cellValue) => {

                    return "descr_" + p_column + "_" + p_cellValue;
                }
            },

            mutations: {

                changeMissingStatus: () => ({ column, value, markAsMissing }) => {},
                selectCategoricalOption: () => ({ optionValue, columnName, rawValue }) => {},
                updateAnnotationCount: () => () => { return 0; }
            }
        };
    });

    it("Displays unique values and their descriptions", () => {

        // Act
        cy.mount(annotCategorical, {

            computed: store.getters,
            propsData: props
        });

        // Assert
        cy.get("[data-cy='categoricalTable']").contains("PD");
        cy.get("[data-cy='categoricalTable']").contains("descr_column1_PD");
    });

    it("Displays a dropdown, selects an option, informs the store about an created/updated mapping by calling a mutation", () => {

        // Setup
        cy.spy(store, "commit").as("commitSpy");

        // Act
        cy.mount(annotCategorical, {

            computed: store.getters,
            mocks: { $store: store },
            plugins: ["vue-select"],
            propsData: props
        });

        // Assert
        cy.get("[data-cy='categoricalTable']").within(() => {
            cy.get("[data-cy='categoricalSelector_0']").should("be.visible");
            cy.get("[data-cy='categoricalSelector_1']").should("be.visible");
            cy.get("[data-cy='categoricalSelector_2']").should("be.visible");
            cy.get("[data-cy='categoricalSelector_3']").should("be.visible");
        });

        // Act
        cy.get("[data-cy='categoricalSelector_0']").click();
        cy.get("[data-cy='categoricalSelector_0']")
            .find("li")
            .contains("option_2")
            .click();

        // Assert
        cy.get("@commitSpy").should("have.been.calledWith", "selectCategoricalOption", {
            optionValue: "https://example.org/option_2",
            columnName: "column1",
            rawValue: "PD"
        });
    });

    it("Displays the preset mapping in the dropdown", () => {

        // Act
        cy.mount(annotCategorical, {

            computed: store.getters,
            mocks: { $store: store },
            plugins: ["vue-select"],
            propsData: props
        });
        cy.get("[data-cy='categoricalSelector_1']").click();

        // Assert
        cy.get("[data-cy='categoricalSelector_1']")
            .find("li")
            .contains("option_0");
        cy.get("[data-cy='categoricalSelector_1']")
            .find("li")
            .contains("option_1");
        cy.get("[data-cy='categoricalSelector_1']")
            .find("li")
            .contains("option_2");
        cy.get("[data-cy='categoricalSelector_1']")
            .find("li")
            .contains("option_3");
    });

    it("Displays the missing value button and designates value as missing when clicked", () => {

        // Setup
        cy.spy(store, "commit").as("commitSpy");

        // Act
        cy.mount(annotCategorical, {

            computed: store.getters,
            mocks: { $store: store },
            propsData: props
        });

        // Assert
        cy.get("[data-cy='missingValueButton_0']").should("be.visible");

        // Act
        cy.get("[data-cy='missingValueButton_1']").click();

        // Assert
        cy.get("@commitSpy").should("have.been.calledOnceWith", "changeMissingStatus", {
            column: "column1",
            value: "HC",
            markAsMissing: true
        });
    });

    it("Can deal with an empty options array without crashing", () => {

        // Setup
        cy.mount(annotCategorical, {

            computed: Object.assign(store.getters, { getCategoricalOptions: () => (p_column) => [],
                getSelectedCategoricalOption: () => (p_rowIndex) => null }),
            mocks: { $store: store },
            propsData: props
        });
    });
});
