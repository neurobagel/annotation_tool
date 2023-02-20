import annotCategorical from "~/components/annot-categorical.vue";


// Mocking the store
const store = {

    commit: () => {},

    getters: {

        getCategoricalOptions: () => (p_column) => {

            return ["option_0", "option_1", "option_2", "option_3"];
        },

        getSelectedOption: () => (p_rowIndex) => {

            return "option_" + p_rowIndex;
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

        designateAsMissing: () => (p_columnName, p_rawValue) => {},
        selectCategoricalOption: () => (p_option, p_columnName, p_rawValue) => {}
    }
};

const props = {

    activeCategory: "category1"
};


describe("Categorical annotation", () => {

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
        cy.get("[data-cy='categoricalSelector_0']").click().contains("option_2").click();

        // Assert
        cy.get("@commitSpy").should("have.been.calledOnceWith", "selectCategoricalOption", "option_2", "column1", "PD");
    });

    it("Displays the preset mapping in the dropdown", () => {

        // Act
        cy.mount(annotCategorical, {
            computed: store.getters,
            propsData: props
        });

        // Assert
        cy.get("[data-cy='categoricalSelector_1']").contains("option_1");
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
        cy.get("@commitSpy").should("have.been.calledOnceWith", "changeMissingStatus", "column1", "HC", true);
    });
});
