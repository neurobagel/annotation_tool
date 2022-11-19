import annotContinuousValues from "~/components/annot-continuous-values";


const store = {
    getters: {
        getActiveHeuristic: () => (activeCategory) => null,
        getHarmonizedPreview: () => (column, missingValue) => null,
        getPreviewValues: () => (activeCategory) => {
            return {
                "column1": ["1Y", "11Y"],
                "column2": ["2,1", "22,1"]
            };
        },
        getTransformHeuristics: () => (activeCategory) => {
            return ["float", "bounded", "euro", "range", "int", "string", "isoyear"];
        }
    }
};


const props = {
    activeCategory: "category1"
};

describe("continuous-values-component", () => {
        it("correctly displays preview values provided by the store", () => {
                cy.mount(annotContinuousValues, {
                    propsData: props,
                    computed: store.getters,
                    plugins: ["vue-select"]
                });
                cy.get("[data-cy='dataTable']").then(table => {
                    // TODO: find a pattern to iterate over the values directly
                    expect(table).to.contain("1Y");
                    expect(table).to.contain("11Y");
                    expect(table).to.contain("2,1");
                    expect(table).to.contain("22,1");
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
                    computed: store.getters,
                    mocks: {
                        $store: mockStore
                    },
                    plugins: ["vue-select"]
                });
                cy.get("[data-cy='selectTransform']").click();
                cy.get("[data-cy='selectTransform']").find("li").contains('float').click();
                cy.get("@dispatchSpy").should('have.been.calledWith', "setHeuristic", "category1", "float");
            }
        );

        it("applies a selected heuristic and previews transformed values", () => {
                cy.mount(annotContinuousValues, {
                        propsData: props,
                        computed: Object.assign(store.getters, {
                            getActiveHeuristic: () => (activeCategory) => "float",
                            getHarmonizedPreview: () => (column, missingValue) => column + "-" + missingValue + "-harmonized"
                        })
                    }
                );
            cy.get("[data-cy='selectTransform']").contains("float");
            cy.get("[data-cy='dataTable']").then(table => {
                // TODO: find a pattern to iterate over the values directly
                expect(table).to.contain("column1-1Y-harmonized");
                expect(table).to.contain("column1-11Y-harmonized");
                expect(table).to.contain("column2-2,1-harmonized");
                expect(table).to.contain("column2-22,1-harmonized");
            });
            }
        );
    }
);
