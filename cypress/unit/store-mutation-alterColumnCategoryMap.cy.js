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

                columnToCategoryMap : {

                    "column1": "Age",
                    "column2": null,
                    "column3": "Sex",
                    "column4": null,
                    "column5": null
                },

                dataDictionary: {

                    annotated: {

                        column1: {

                            description: "",
                            missingValues: []
                        },
                        column2: {

                            description: "",
                            missingValues: []
                        },
                        column3: {

                            description: "",
                            missingValues: []
                        }
                    },

                    userProvided: {

                        column1: { description: "" },
                        column2: { description: "" },
                        column3: { description: "" }
                    }
                }
            }
        };
    });

    it("Removes the mapping of column to category if they're already mapped", () => {

        // Act
        mutations.alterColumnCategoryMapping(store.state, { category: "Sex", columnName: "column3" });

        // Assert
        expect(store.state.columnToCategoryMap.column3).to.equal(null);
    });

    it("Changes the mapping of column to category if they're not already mapped", () => {

        // Act
        mutations.alterColumnCategoryMapping(store.state, { category: "someCategory", columnName: "column1" });

        // Assert
        expect(store.state.columnToCategoryMap.column1).to.equal("someCategory");
        expect(store.state.dataDictionary.annotated.column1).to.deep.equal(reinitializedAnnotatedColumn);

        // Act
        mutations.alterColumnCategoryMapping(store.state, { category: "someCategory", columnName: "column2" });

        // Assert
        expect(store.state.columnToCategoryMap.column2).to.equal("someCategory");
        expect(store.state.dataDictionary.annotated.column2).to.deep.equal(reinitializedAnnotatedColumn);
    });
});
