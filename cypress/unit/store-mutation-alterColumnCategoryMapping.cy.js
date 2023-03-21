import { mutations } from "~/store";

// Setup
const reinitializedAnnotatedColumn = {

    description: "",
    missingValues: []
};
let store;

describe("alterColumnCategoryMapping", () => {

    beforeEach(() => {

        store = {

            state: {

                columnToCategoryMapping : {

                    "column1": "Age",
                    "column2": null,
                    "column3": "Sex",
                    "column4": null,
                    "column5": null
                },

                dataDictionary: {

                    annotated: {

                        column3: {

                        }
                    },

                    userProvided: {

                    }
                }
            }
        };
    });

    it("Removes the mapping of column to category if they're already mapped", () => {

        // Act
        mutations.alterColumnCategoryMapping(store.state, { category: "Sex", column: "column3" });

        // Assert
        expect(store.state.columnToCategoryMapping.column3).to.equal(null);
    });

    it("Changes the mapping of column to category if they're not already mapped", () => {

        // Act
        mutations.alterColumnCategoryMapping(store.state, { category: "someCategory", column: "column1" });

        // Assert
        expect(store.state.columnToCategoryMapping.column1).to.equal("someCategory");
        expect(store.state.dataDictionary.annotated.column1).to.deep.equal(reinitializedAnnotatedColumn);

        // Act
        mutations.alterColumnCategoryMapping(store.state, { category: "someCategory", column: "column2" });

        // Assert
        expect(store.state.columnToCategoryMapping.column2).to.equal("someCategory");
        expect(store.state.dataDictionary.annotated.column2).to.deep.equal(reinitializedAnnotatedColumn);
    });
});
