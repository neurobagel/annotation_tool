import { mutations } from "~/store";

let store;

describe("selectCategoricalOption mutation", () => {

    beforeEach(() => {

        store = {

            state: {

                dataDictionary: {

                    annotated: {

                        column1: {}
                    }
                }
            }
        };
    });

    it("Makes sure a value map is created for a column in the data dictionary", () => {

        // Act
        mutations.selectCategoricalOption(store.state, "https://example.org/female", "column1", "F");

        // Assert
        expect(store.state.dataDictionary.annotated.column1.valueMap).to.exist;
    });

    it("Makes sure an annotated value is set in the value map", () => {

        // Act
        mutations.selectCategoricalOption(store.state, "https://example.org/female", "column1", "F");

        // Assert
        expect(store.state.dataDictionary.annotated.column1.valueMap["F"]).to.equal("https://example.org/female");
    });

    it("Makes sure a value in the value map can be overwritten", () => {

        // Act
        mutations.selectCategoricalOption(store.state, "https://example.org/female", "column1", "F");
        mutations.selectCategoricalOption(store.state, "https://example.org/male", "column1", "F");

        // Assert
        expect(store.state.dataDictionary.annotated.column1.valueMap["F"]).to.equal("https://example.org/male");
    });
});