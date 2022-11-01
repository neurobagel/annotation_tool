import annotMissingValues from "~/components/annot-missing-values";


// Mocked Store getters
const getters = {
    valueDescription: () => (column, missingValue) => missingValue + " from " + column,
    missingValues: () => (category) => {
        return {
            "column1": ["val1", "val2"],
            "column2": ["val3"]
        };
    }
};

const props = {
    activeCategory: "category1"
};

describe("missing values", () => {

        it('displays unique values and description', () => {
                cy.mount(annotMissingValues, {
                        propsData: props,
                        computed: getters
                    }
                );
                cy.get('.missing-values-card-body').contains('val1 from column1');
            }
        );

    it.only('handles lack of description gracefully', () => {
            cy.mount(annotMissingValues, {
                    propsData: props,
                    computed: Object.assign(getters, {valueDescription: () => (col, mis) => null })
                }
            );
        }
    );
    }
);
