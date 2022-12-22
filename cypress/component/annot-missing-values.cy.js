import annotMissingValues from "~/components/annot-missing-values";


// Mocked Store getters
const store = {
    getters: {
        getValueDescription: () => (column, missingValue) => missingValue + " from " + column,
        missingValues: () => (category) => {
            return {
                "column1": ["val1", "val2"],
                "column2": ["val3"]
            };
        }
    }
};

const props = {
    activeCategory: "category1"
};

describe("missing values", () => {

        it('displays unique values and description', () => {
                cy.mount(annotMissingValues, {
                        propsData: props,
                        computed: store.getters
                    }
                );
                cy.get('.missing-values-card-body').contains('val1 from column1');
            }
        );

        it('handles lack of description gracefully', () => {
                cy.mount(annotMissingValues, {
                        propsData: props,
                        computed: Object.assign(store.getters, {valueDescription: () => (col, mis) => null})
                    }
                );
            }
        );

        it("can be declared 'not missing' by clicking the 'Not Missing' button", () => {
                const mockStore = {commit: () => {}};
                cy.spy(mockStore, 'commit').as('commitSpy');

                cy.mount(annotMissingValues, {
                        propsData: props,
                        computed: store.getters,
                        mocks: {
                            $store: mockStore
                        }
                    }
                );
                cy.get("[data-cy='not-missing-button-column1-val1']").click();
                cy.get("@commitSpy").should('have.been.calledWith', "declareNotMissing", {column: "column1", value: "val1"});
            }
        );
    }
);
