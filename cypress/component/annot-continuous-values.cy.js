import annotContinuousValues from "~/components/annot-continuous-values";


const getters = {
    getPreviewValues: () => (activeCategory) => {
        return {
            "column1": ["val1", "val11"],
            "column2": ["val2", "val22"]
        };
    },
    getHarmonizedPreview: () => (column, missingValue) => column + "-" + missingValue + "-harmonized",
    getTransformHeuristics: () => (activeCategory) => {
        return ["float", "bounded", "euro", "range", "int", "string", "isoyear"];
    }
};

const props = {
    activeCategory: "category1"
};

describe("continuous-values-component", () => {
        it("correctly displays preview values provided by the store", () => {
                cy.mount(annotContinuousValues, {
                    propsData: props,
                    computed: getters,
                    plugins: ["vue-select"]
                });
                cy.get('.table').then(table => {
                    // TODO: find a pattern to iterate over the values directly
                    expect(table).to.contain("val1");
                    expect(table).to.contain("val11");
                    expect(table).to.contain("val2");
                    expect(table).to.contain("val22");
                });

            }
        );

        it("can select a transformation and then dispatches it to the store", () => {
                const mockStore = {
                    dispatch: () => {
                    }
                };
                cy.spy(mockStore, 'dispatch').as('dispatchSpy');

                cy.mount(annotContinuousValues, {
                    propsData: props,
                    computed: getters,
                    mocks: {
                        $store: mockStore
                    },
                    plugins: ["vue-select"]
                });
                cy.get(".v-select").click();
                cy.get(".v-select").find("li").contains('float').click();
                cy.get("@dispatchSpy").should('have.been.calledWith', "setHeuristic", "float");
            }
        );
    }
);
