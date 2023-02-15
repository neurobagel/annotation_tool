import { getters } from "~/store";

const store = {

    getters: getters,
    state: {

        columnToCategoryMapping: {

            column1: "category1",
            column2: "category1",
            column3: "category2"
        },

        dataDictionary: {

            annotated: {

                column1: {

                    missingValues: [1, 2, 3]
                },

                column2: {

                    missingValues: [4, 5, 6]
                },

                column3: {}
            }
        }
    }
};

describe("getMissingValues", () => {

    it("Retrieves the missing values of a category that has columns with missing values", () => {

        // Act
        const missingValues = store.getters.getMissingValues(store.state)("category1");

        // Assert
        expect(missingValues).to.deep.equal({
            column1: [1, 2, 3],
            column2: [4, 5, 6]
        });
    });

    it("Attempts to retrieve the missing values of a category has a column with no missing values", () => {

        // Act
        const missingValues = store.getters.getMissingValues(store.state)("category2");

        // Assert
        expect(missingValues).to.deep.equal({ column3: [] });
    });

    it("Attempts to retrieve the missing values of a category has *no* linked columns", () => {

        // Act
        const missingValues = store.getters.getMissingValues(store.state)("category3");

        // Assert
        expect(missingValues).to.deep.equal({});
    });
});