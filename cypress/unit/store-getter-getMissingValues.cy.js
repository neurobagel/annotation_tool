import { getters } from "~/store";

const store = {

    getters: getters,
    state: {

        dataDictionary: {

            annotated: {

                column1: {

                    missingValues: [1, 2, 3]
                },

                column2: {}
            }
        }
    }
};

describe("getMissingValues", () => {

    it("Retrieves the missing values of a column that has missing values", () => {

        // Act
        const missingValues = store.getters.getMissingValues(store.state)("column1");

        // Assert
        expect(missingValues).to.deep.equal([1, 2, 3]);
    });

    it("Attempts to retrieve the missing values of a column has *no* missing values", () => {

        // Act
        const missingValues = store.getters.getMissingValues(store.state)("column2");

        // Assert
        expect(missingValues).to.deep.equal([]);
    });

    it("Attempts to retrieve the missing values of a column has *no* entry in the data dictionary", () => {

        // Act
        const missingValues = store.getters.getMissingValues(store.state)("column3");

        // Assert
        expect(missingValues).to.deep.equal([]);
    });
});