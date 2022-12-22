import annotCategorical from "~/components/annot-categorical.vue";


// Mocking the store
const store = {
    commit: () => {},
    getters: {
        getUniqueValues: () => (activeCategory) => {
            return [
                {
                    columnName: "column1", rawValue: "PD"
                },
                {
                    columnName: "column1", rawValue: "HC"
                },
                {
                    columnName: "column2", rawValue: ""
                },
                {
                    columnName: "column2", rawValue: "oups"
                }
            ];
        },
        getValueDescription: () => (column, cellValue) => {
            return "descr_" + column + "_" + cellValue;
        },
        getOptions: () => (category) => {
            return [
                "option_0",
                "option_1",
                "option_2",
                "option_3"
            ];
        },
        getSelectedOption: () => (rowIndex) => {
            return "option_" + rowIndex;
        }
    },
    mutations: {
        selectAnOption: () => (option, columnName, rawValue) => {
        },
        designateAsMissing: () => (columnName, rawValue) => {
        }
    }
};

const props = {
    activeCategory: "category1"
};


describe("categorical annotation", () => {
    it("displays unique values and their descriptions", () => {
        cy.mount(annotCategorical, {
                computed: store.getters,
                propsData: props
            });
            cy.get("[data-cy='categoricalTable']").contains("PD");
            cy.get("[data-cy='categoricalTable']").contains("descr_column1_PD");
        }
    );
    it("displays a dropdown, selects an option, informs the store about an created/updated mapping by calling a mutation", () => {
        cy.spy(store, 'commit').as('commitSpy');
        cy.mount(annotCategorical, {
            computed: store.getters,
            propsData: props,
            mocks: {
                $store: store
            }
            });
        cy.get("[data-cy='categoricalTable']").within(() => {
            cy.get("[data-cy='categoricalSelector_0']").should("be.visible");
            cy.get("[data-cy='categoricalSelector_1']").should("be.visible");
            cy.get("[data-cy='categoricalSelector_2']").should("be.visible");
            cy.get("[data-cy='categoricalSelector_3']").should("be.visible");
        });

        cy.get("[data-cy='categoricalSelector_0']").click().contains("option_2").click();
        cy.get("@commitSpy").should("have.been.calledOnceWith", "selectAnOption", "option_2", "column1", "PD");
    });
    it("displays the pre-set mapping in the dropdown", () => {
        cy.mount(annotCategorical, {
            computed: store.getters,
            propsData: props
            });
        cy.get("[data-cy='categoricalSelector_1']").contains("option_1");
    });
    it("displays the missing value button and designates value as missing when clicked", () => {
        cy.spy(store, 'commit').as('commitSpy');
        cy.mount(annotCategorical, {
            computed: store.getters,
            propsData: props,
            mocks: {
                $store: store
            }

            });
        cy.get("[data-cy='missingValueButton_0']").should("be.visible");
        cy.get("[data-cy='missingValueButton_1']").click();
        cy.get("@commitSpy").should("have.been.calledOnceWith", "designateAsMissing", "column1", "HC");
    });
});
