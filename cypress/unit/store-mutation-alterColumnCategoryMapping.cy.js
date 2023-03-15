import { mutations } from "~/store";

// Setup
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
        expect(store.state.dataDictionary.annotated.column1).to.deep.equal({ description: "" });

        // Act
        mutations.alterColumnCategoryMapping(store.state, { category: "someCategory", column: "column2" });

        // Assert
        expect(store.state.columnToCategoryMapping.column2).to.equal("someCategory");
        expect(store.state.dataDictionary.annotated.column2).to.deep.equal({ description: "" });
    });

    it("Unlink a category from a column that is not listed in the user provided data dictionary", () => {

        // Act
        mutations.alterColumnCategoryMapping(store.state, { category: "Sex", column: "column3" });

        // Assert
        expect(store.state.dataDictionary.annotated["column3"]).to.deep.equal({ "description": "" });
    });

    it("Unlink a category from a column that is listed in the user provided data dictionary", () => {

        // Setup
        store.state.dataDictionary.userProvided["column3"] = { description: "filled in description" };

        // Act
        mutations.alterColumnCategoryMapping(store.state, { category: "Sex", column: "column3" });

        // Assert
        expect(store.state.dataDictionary.annotated["column3"]).to.deep.equal({ description: "filled in description" });
    });
});
